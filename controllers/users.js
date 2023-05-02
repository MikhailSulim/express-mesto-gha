const User = require("../models/user");

// вариант экспорта контроллеров каждому по отдельности
exports.getUsers = (req, res) => {
  // функция получения данных всех пользователей
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => res.status(500).send(err.message("Users not found")));
};

exports.getUser = (req, res) => {
  // функция получения данных пользователя по идентификатору
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(404).send(err.message);
      } else {
        res.status(500).send({ message: "Something went wrong" });
      }
    });
};

exports.createUser = (req, res) => {
  // функция создания нового пользователя
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      res.status(500).send({ message: "User wasn't create" });
    });
};

exports.updateUser = (req, res) => {
  // функция обновления данных пользователя по иего идентификатору
  
};

exports.updateAvatar = (req, res) => {
  // функция обновления аватара пользователя по его идентификатору
};

// module.exports = { getUsers, getUser, createUser };
