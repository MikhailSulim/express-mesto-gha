const { DocumentNotFoundError, CastError, ValidationError } =
  require('mongoose').Error;
const Card = require('../models/card');
const {
  CREATED_CODE,
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require('../utils/constants');

// вариант экспорта контроллеров всех сразу в конце
const getCards = (req, res) => {
  // функция получения данных всех карточек
  Card.find({})
    .populate(['owner', 'likes']) // чтобы получить всю информацию об авторе
    .then((cards) => res.send({ data: cards }))
    .catch((err) =>
      res.status(INTERNAL_SERVER_ERROR_CODE).send({
        message: `На сервере произошла ошибка: ${err.name} ${err.message}`,
      })
    );
};

const createCard = (req, res) => {
  // функция создания карточки
  const { name, link } = req.body;
  const { _id: userId } = req.user;

  Card.create({ name, link, owner: userId })
    .then((card) => card.populate('owner'))
    .then((card) => res.status(CREATED_CODE).send(card)) // возврат записанных в базу данных
    .catch((err) => {
      if (err instanceof ValidationError) {
        const errorMessage = Object.values(err.errors)
          .map((error) => error.message)
          .join(' ');
        res
          .status(BAD_REQUEST_CODE)
          .send({ message: `Некорректные данные карточки: ${errorMessage}` });
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({
          message: `На сервере произошла ошибка: ${err.name} ${err.message}`,
        });
      }
    });
};

const deleteCard = (req, res) => {
  // функция удаления карточки
  const { cardId } = req.params;
  const { _id: userId } = req.user;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new Error({ message: 'Карточка с данным id не найдена' });
      }
      if (userId !== card.owner.toString()) {
        throw new Error({ message: 'Вы не можете удалить эту карточку' });
      }
      return Card.findByIdAndRemove(cardId).then(() =>
        res.send({ message: 'Карточка удалена' })
      );
    })
    .catch((err) => {
      if (err instanceof CastError) {
        res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Некорректный id карточки' });
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({
          message: `На сервере произошла ошибка: ${err.name} ${err.message}`,
        });
      }
    });
};

const handleLikeCard = (req, res, likeOptions) => {
  Card.findByIdAndUpdate(req.params.cardId, likeOptions, { new: true })
    .orFail()
    .then((card) => card.populate(['owner', 'likes']))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Передан id несуществующей карточки' });
        return;
      }
      if (err instanceof CastError) {
        res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Передан некорректный id карточки' });
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({
          message: `На сервере произошла ошибка: ${err.name} ${err.message}`,
        });
      }
    });
};

const likeCard = (req, res) => {
  // функция поставить лайк карточке по её идентификатору
  const { _id: userId } = req.user;
  const likeOptions = { $addToSet: { likes: userId } }; // добавить _id в массив, если его там нет

  handleLikeCard(req, res, likeOptions);
};

const dislikeCard = (req, res) => {
  // функция снять лайк карточке по её идентификатору
  const { _id: userId } = req.user;
  const likeOptions = { $pull: { likes: userId } }; // убрать _id из массива

  handleLikeCard(req, res, likeOptions);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
