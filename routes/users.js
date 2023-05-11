const express = require('express');
const auth = require('../middlewares/auth');

const userRouter = express.Router();
const {
  getUsers,
  getUser,
  // createUser,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

userRouter.get('/users', auth, getUsers); // возвращает всех пользователей

userRouter.get('/users/me', auth, getCurrentUser); // возвращает данные текущего пользователя

userRouter.get('/users/:userId', auth, getUser); // возвращает пользователя по _id

userRouter.patch('/users/me', auth, updateUser); // обновляет профиль

userRouter.patch('/users/me/avatar', auth, updateAvatar); // обновляет аватар

module.exports = userRouter;
