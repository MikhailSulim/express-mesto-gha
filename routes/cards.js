const express = require('express');
const auth = require('../middlewares/auth');

const cardRouter = express.Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/cards', auth, getCards); // возвращает все карточки

cardRouter.post('/cards', createCard); // создаёт карточку

cardRouter.delete('/cards/:cardId', auth, deleteCard); // удаляет карточку по идентификатору

cardRouter.put('/cards/:cardId/likes', auth, likeCard); // поставить лайк карточке

cardRouter.delete('/cards/:cardId/likes', auth, dislikeCard); // убрать лайк с карточки

module.exports = cardRouter;
