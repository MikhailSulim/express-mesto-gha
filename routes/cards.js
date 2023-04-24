const express = require("express");
const cardRouter = express.Router();
const { getCards, createCard, getCard } = require("../controllers/cards");

cardRouter.get("/cards", getCards);

cardRouter.post("/cards", createCard);

cardRouter.get("/cards/:cardId", getCard);

module.exports = cardRouter;
