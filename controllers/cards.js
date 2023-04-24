const Card = require("../models/card");

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => res.status(500).send(err.message("Cards not found")));
};

const getCard = (req, res) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail()
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      console.log(err);
      if (err.name == "CastError") {
        res.status(404).send(err.message);
      } else {
        res.status(500).send({ message: "Something went wrong" });
      }
    });
};

const createCard = (req, res) => {
  const { name, link, owner, likes, createdAt } = req.body;

  Card.create({ name, link, owner, likes, createdAt }).then((card) => {
    res.status(201).send(card);
  });
};

module.exports = { getCards, getCard, createCard };
