const { CastError, ValidationError } = require('mongoose').Error;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET } = require('../utils/config');

// импорт кастомных классов ошибок
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const { CODE_CREATED_201 } = require('../utils/constants');

// вариант экспорта контроллеров каждому по отдельности
exports.getUsers = (req, res, next) => {
  // функция получения данных всех пользователей
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
};

exports.getUser = (req, res, next) => {
  // функция получения данных пользователя по идентификатору
  const { userId } = req.params;
  User.findById(userId)

    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с таким id не найден');
      }

      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Некорректный id пользователя'));
      } else {
        next(err);
      }
    });
};

exports.createUser = (req, res, next) => {
  // функция создания нового пользователя
  const {
    name, about, avatar, email, password,
  } = req.body;
  // хешируем пароль
  bcrypt.hash(password, 10).then((hash) => User.create({
    name, about, avatar, email, password: hash,
  }) // запись в бд
    .then((user) => {
      res.status(CODE_CREATED_201).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
        return;
      }

      if (err instanceof ValidationError) {
        const errorMessage = Object.values(err.errors)
          .map((error) => error.message)
          .join(' ');
        next(new BadRequestError(`Некорректные данные пользователя: ${errorMessage}`));
      } else {
        next(err);
      }
    }));
};

const updateProfile = (req, res, next, updData) => {
  // функция обновления профиля пользователя
  const { _id: userId } = req.user;

  User.findByIdAndUpdate(userId, updData, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с данным id не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        const errorMessage = Object.values(err.errors)
          .map((error) => error.message)
          .join(' ');
        next(new BadRequestError(`Некорректные данные пользователя при обновлении профиля ${errorMessage}`));
      } else {
        next(err);
      }
    });
};

exports.updateUser = (req, res, next) => {
  // функция обновления данных пользователя по его идентификатору
  const { name, about } = req.body;
  updateProfile(req, res, next, { name, about });
};

exports.updateAvatar = (req, res, next) => {
  // функция обновления аватара пользователя по его идентификатору
  const { avatar } = req.body;
  updateProfile(req, res, next, { avatar });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        { _id: user._id }, // пейлоуд токена
        JWT_SECRET, // секретный ключ подписи
        { expiresIn: '7d' }, // токен будет просрочен через 7 дней
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: true,
        })
        .send({ token });
    })
    .catch(next);

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
