const Card = require("../models/card");

// вариант экспорта контроллеров всех сразу в конце
const getCards = (req, res) => {
  // функция получения данных всех карточек
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => res.status(500).send(err.message("Cards not found")));
};

// const getCard = (req, res) => {
//   const { cardId } = req.params;
//   Card.findById(cardId)
//     .orFail()
//     .then((card) => {
//       res.send({ data: card });
//     })
//     .catch((err) => {
//       console.log(err);
//       if (err.name == "CastError") {
//         res.status(404).send(err.message);
//       } else {
//         res.status(500).send({ message: "Something went wrong" });
//       }
//     });
// };

const createCard = (req, res) => {
  // функция создания карточки
  const { name, link } = req.body;
  const { _id: userId } = req.user;

  Card.create({ name, link, owner: userId }).then((card) => {
    res.status(201).send(card);
  });
};

const deleteCard = (req, res) => {
  // функция удаления карточки
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId).then((card) => {
    res.send(card);
  });
};

const likeCard = (req, res) => {
  // функция поставить лайк карточке по её идентификатору
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  );
};

const dislikeCard = (req, res) => {
  // функция снять лайк карточке по её идентификатору
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  );
};

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
