const express = require("express");
const cardRouter = express.Router();
const { getCards, createCard, deleteCard, likeCard, dislikeCard } = require("../controllers/cards");


cardRouter.get("/cards", getCards);  // возвращает все карточки

cardRouter.post("/cards", createCard); // создаёт карточку

cardRouter.delete("/cards/:cardId", deleteCard);  // удаляет карточку по идентификатору

cardRouter.put("/cards/:cardId/likes", likeCard); // поставить лайк карточке

cardRouter.delete("/cards/:cardId/likes", dislikeCard); // убрать лайк с карточки

module.exports = cardRouter;
