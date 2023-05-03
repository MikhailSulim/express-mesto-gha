const Card = require("../models/card");

// вариант экспорта контроллеров всех сразу в конце
const getCards = (req, res) => {
  // функция получения данных всех карточек
  Card.find({})
    .populate(["owner", "likes"]) // чтобы получить всю информацию об авторе
    .then((cards) => res.send({ data: cards }))
    .catch((err) =>
      res.status(500).send({
        message: `На сервере произошла ошибка: ${err.name} ${err.message}`,
      })
    );
};

const createCard = (req, res) => {
  // функция создания карточки
  const { name, link } = req.body;
  const { _id: userId } = req.user;

  Card.create({ name, link, owner: userId })
    .then((card) => card.populate("owner"))
    .then((card) => res.status(201).send(card)) // возврат записанных в базу данных
    .catch((err) => {
      if (err.name === "ValidationError") {
        const errorMessage = Object.values(err.errors)
          .map((err) => err.message)
          .join(" ");
        res
          .status(400)
          .send({ message: `Некорректные данные карточки: ${errorMessage}` });
      } else {
        res.status(500).send({
          message: `На сервере произошла ошибка: ${err.name} ${errorMessage}`,
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
      if (err.name === "CastError") {
        res.status(404).send({ message: "Карточка с данным id не найдена" });
      } else {
        res.status(500).send({
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
    { new: true }
  )
    .orFail()
    .then((card) => card.populate(["owner", "likes"]))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(404).send({ message: "Передан id несуществующей карточки" });
      } else {
        res.status(500).send({
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
    { new: true } // обработчик then получит на вход обновлённую запись
  )
    .orFail()
    .then((card) => card.populate(["owner", "likes"]))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(404).send({ message: "Передан id несуществующей карточки" });
      } else {
        res.status(500).send({
          message: `На сервере произошла ошибка: ${err.name} ${err.message}`,
        });
      }
    });
};

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
