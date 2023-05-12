const { celebrate, Joi } = require('celebrate');
const express = require('express');

const { REGEX_URL } = require('../utils/constants');

const cardRouter = express.Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/', getCards); // возвращает все карточки

cardRouter.post(
  // создаёт карточку
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().regex(REGEX_URL),
    }),
  }),
  createCard,
);

cardRouter.delete(
  // удаляет карточку по идентификатору
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteCard,
);

cardRouter.put(
  // поставить лайк карточке
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  likeCard,
);

cardRouter.delete(
  // убрать лайк с карточки
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  dislikeCard,
);

module.exports = cardRouter;
