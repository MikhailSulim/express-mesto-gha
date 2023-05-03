const User = require("../models/user");

// вариант экспорта контроллеров каждому по отдельности
exports.getUsers = (req, res) => {
  // функция получения данных всех пользователей
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) =>
      res.status(500).send({
        message: `На сервере произошла ошибка: ${err.name} ${err.message}`,
      })
    );
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
        res.status(404).send({ message: "Пользователь с таким id не найден" });
      } else {
        res.status(500).send({
          message: `На сервере произошла ошибка: ${err.name} ${err.message}`,
        });
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
      if (err.name === "ValidationError") {
        const errorMessage = Object.values(err.errors)
          .map((err) => err.message)
          .join(" ");
        res.status(400).send({
          message: `Некорректные данные пользователя: ${errorMessage}`,
        });
      } else {
        res.status(500).send({
          message: `На сервере произошла ошибка: ${err.name} ${errorMessage}`,
        });
      }
    });
};

exports.updateUser = (req, res) => {
  // функция обновления данных пользователя по иего идентификатору
  const { _id: userId } = req.user;
  const updateOptions = req.body;

  User.findByIdAndUpdate(
    userId, // идентификатор в строковом виде
    updateOptions, // объект со свойствами, которые нужно обновить
    {
      // объект опций
      // new	передать обновлённый объект на вход обработчику then	(по ум. false)
      // runValidators	валидировать новые данные пе-ред записью в базу	(по ум. false)
      // upsert	если документ не найден, создать его	(по ум. false)
      new: true,
      runValidators: true,
    }
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(404).send({ message: "Пользователя с данным id не найден" });
        return;
      }
      if (err.name === "ValidationError") {
        const errorMessage = Object.values(err.errors)
          .map((err) => err.message)
          .join(" ");
        res.status(400).send({
          message: `Некорректные данные пользователя при обновлении профиля ${errorMessage}`,
        });
      } else {
        res.status(500).send({
          message: `На сервере произошла ошибка: ${err.name} ${err.message}`,
        });
      }
    });
};

exports.updateAvatar = (req, res) => {
  // функция обновления аватара пользователя по его идентификатору
  const { _id: userId } = req.user;
  const updateOptions = req.body;

  User.findByIdAndUpdate(userId, updateOptions, {
    new: true,
    runValidators: true,
  })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(404).send({ message: "Пользователя с данным id не найден" });
        return;
      }
      if (err.name === "ValidationError") {
        const errorMessage = Object.values(err.errors)
          .map((err) => err.message)
          .join(" ");
        res.status(400).send({
          message: `Некорректные данные пользователя при обновлении профиля ${errorMessage}`,
        });
      } else {
        res.status(500).send({
          message: `На сервере произошла ошибка: ${err.name} ${err.message}`,
        });
      }
    });
};
