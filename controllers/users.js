const User = require("../models/user");

// TODO написать статусы
// TODO написать отлов ошибок

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => res.status(500).send(err.message("Users not found")));
};

const getUser = (req, res) => {
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

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      res.status(500).send({ message: "User wasn't create" });
    });
};

module.exports = { getUsers, getUser, createUser };
