const express = require('express');

const userRouter = express.Router();
const {
  getUsers,
  getUser,
  //createUser,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

userRouter.get('/users', getUsers); // возвращает всех пользователей

userRouter.get('/users/me', getCurrentUser); // возвращает данные текущего пользователя
userRouter.get('/users/:userId', getUser); // возвращает пользователя по _id


//userRouter.post('/users', createUser); // создаёт пользователя

userRouter.patch('/users/me', updateUser); // обновляет профиль

userRouter.patch('/users/me/avatar', updateAvatar); // обновляет аватар

module.exports = userRouter;
