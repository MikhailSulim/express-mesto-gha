const express = require('express');
// const auth = require('../middlewares/auth');
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');
const { REGEX_URL } = require('../utils/constants');

const userRouter = express.Router();
const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

userRouter.get('/', getUsers); // возвращает всех пользователей

userRouter.get('/me', getCurrentUser); // возвращает данные текущего пользователя

userRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUser); // возвращает пользователя по _id

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser); // обновляет профиль

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(REGEX_URL),
  }),
}), updateAvatar); // обновляет аватар

module.exports = userRouter;
