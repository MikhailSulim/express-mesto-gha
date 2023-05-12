const { CastError, ValidationError } = require('mongoose').Error;

// импорт кастомных классов ошибок
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const Card = require('../models/card');
const { CODE_CREATED_201 } = require('../utils/constants');

// вариант экспорта контроллеров всех сразу в конце
const getCards = (req, res, next) => {
  // функция получения данных всех карточек
  Card.find({})
    .populate(['owner', 'likes']) // чтобы получить всю информацию об авторе
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  // функция создания карточки
  const { name, link } = req.body;
  const { _id: userId } = req.user;

  Card.create({ name, link, owner: userId })
    .then((card) => card.populate('owner'))
    .then((card) => res.status(CODE_CREATED_201).send(card)) // возврат записанных в базу данных
    .catch((err) => {
      if (err instanceof ValidationError) {
        const errorMessage = Object.values(err.errors)
          .map((error) => error.message)
          .join(' ');
        next(new BadRequestError(`Некорректные данные карточки: ${errorMessage}`));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  // функция удаления карточки
  const { cardId } = req.params;
  const { _id: userId } = req.user;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с данным id не найдена');
      }
      if (userId !== card.owner.toString()) {
        throw new ForbiddenError('Вы не можете удалить эту карточку');
      }
      return Card.findByIdAndRemove(cardId)
        .then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Некорректный id карточки'));
      } else {
        next(err);
      }
    });
};

const handleLikeCard = (req, res, next, likeOptions) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан id несуществующей карточки');
      }

      return Card.findByIdAndUpdate(cardId, likeOptions, { new: true })
        .then((updCard) => updCard.populate(['owner', 'likes']))
        .then((updCard) => res.send(updCard));
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Передан некорректный id карточки'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  // функция поставить лайк карточке по её идентификатору
  const { _id: userId } = req.user;
  const likeOptions = { $addToSet: { likes: userId } }; // добавить _id в массив, если его там нет

  handleLikeCard(req, res, next, likeOptions);
};

const dislikeCard = (req, res, next) => {
  // функция снять лайк карточке по её идентификатору
  const { _id: userId } = req.user;
  const likeOptions = { $pull: { likes: userId } }; // убрать _id из массива

  handleLikeCard(req, res, next, likeOptions);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
