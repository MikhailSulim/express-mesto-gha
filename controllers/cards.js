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
    .catch((err) => res.status(INTERNAL_SERVER_ERROR_CODE).send({
      message: `На сервере произошла ошибка: ${err.name} ${err.message}`,
    }));
};

const createCard = (req, res) => {
  // функция создания карточки
  const { name, link } = req.body;
  const { _id: userId } = req.user;

  Card.create({ name, link, owner: userId })
    .then((card) => card.populate('owner'))
    .then((card) => res.status(CREATED_CODE).send(card)) // возврат записанных в базу данных
    .catch((err) => {
      if (err.name === 'ValidationError') {
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
  Card.findByIdAndRemove(cardId)
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Карточка с данным id не найдена' });
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
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: userId } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail()
    .then((card) => card.populate(['owner', 'likes']))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Передан id несуществующей карточки' });
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({
          message: `На сервере произошла ошибка: ${err.name} ${err.message}`,
        });
      }
    });
};

const dislikeCard = (req, res) => {
  // функция снять лайк карточке по её идентификатору
  const { _id: userId } = req.user;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: userId } }, // убрать _id из массива
    { new: true }, // обработчик then получит на вход обновлённую запись
  )
    .orFail()
    .then((card) => card.populate(['owner', 'likes']))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Передан id несуществующей карточки' });
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({
          message: `На сервере произошла ошибка: ${err.name} ${err.message}`,
        });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
