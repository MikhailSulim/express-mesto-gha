const User = require("../models/user");

// TODO написать статусы
// TODO написать отлов ошибок
// TODO убрать __v



const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => console.log(err));
};

const getUser = (req, res) => {
  const { userId } = req.params;
  // console.log(req.params, typeof userId);
  User.findById(userId).then((user) => {
    res.send(user);
  });
};

const createUser = (req, res) => {
  // console.log(req.body);
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar }).then((user) => {
    res.send(user);
  });
};

module.exports = { getUsers, getUser, createUser };
