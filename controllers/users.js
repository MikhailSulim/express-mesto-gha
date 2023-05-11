const { DocumentNotFoundError, CastError, ValidationError } =
  require('mongoose').Error;
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../utils/config');

const {
  CREATED_CODE,
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require('../utils/constants');

// вариант экспорта контроллеров каждому по отдельности
exports.getUsers = (req, res) => {
  // функция получения данных всех пользователей
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) =>
      res.status(INTERNAL_SERVER_ERROR_CODE).send({
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
      if (err instanceof DocumentNotFoundError) {
        res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Пользователь с таким id не найден' });
        return;
      }
      if (err instanceof CastError) {
        res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Некорректный id пользователя' });
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({
          message: `На сервере произошла ошибка: ${err.name} ${err.message}`,
        });
      }
    });
};

exports.createUser = (req, res) => {
  // функция создания нового пользователя
  const { name, about, avatar, email, password } = req.body;
  // хешируем пароль
  bcrypt.hash(password, 10).then((hash) =>
    User.create({ name, about, avatar, email, password: hash })
      .then((user) => {
        res.status(CREATED_CODE).send(user);
      })
      .catch((err) => {
        if (err instanceof ValidationError) {
          const errorMessage = Object.values(err.errors)
            .map((error) => error.message)
            .join(' ');
          res.status(BAD_REQUEST_CODE).send({
            message: `Некорректные данные пользователя: ${errorMessage}`,
          });
        } else {
          res.status(INTERNAL_SERVER_ERROR_CODE).send({
            message: `На сервере произошла ошибка: ${err.name} ${err.message}`,
          });
        }
      })
  );
};

const updateProfile = (req, res, updData) => {
  const { _id: userId } = req.user;

  User.findByIdAndUpdate(userId, updData, {
    new: true,
    runValidators: true,
  })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Пользователя с данным id не найден' });
        return;
      }
      if (err instanceof ValidationError) {
        const errorMessage = Object.values(err.errors)
          .map((error) => error.message)
          .join(' ');
        res.status(BAD_REQUEST_CODE).send({
          message: `Некорректные данные пользователя при обновлении профиля ${errorMessage}`,
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({
          message: `На сервере произошла ошибка: ${err.name} ${err.message}`,
        });
      }
    });
};

exports.updateUser = (req, res) => {
  // функция обновления данных пользователя по его идентификатору
  const { name, about } = req.body;
  updateProfile(req, res, { name, about });
};

exports.updateAvatar = (req, res) => {
  // функция обновления аватара пользователя по его идентификатору
  const { avatar } = req.body;
  updateProfile(req, res, { avatar });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        { _id: user._id }, // пейлоуд токена
        JWT_SECRET, // секретный ключ подписи
        { expiresIn: '7d' } // токен будет просрочен через 7 дней
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: true,
        })
        .send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });

  /* Метод bcrypt.compare работает асинхронно,
  поэтому результат нужно вернуть и обработать в следующем then.
  Если хеши совпали, в следующий then придёт true, иначе — false: */
};

exports.getCurrentUser = (req, res, next) => {
  // функция получения данных о текущем пользователе
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => res.send(user))
    .catch(next);
};
