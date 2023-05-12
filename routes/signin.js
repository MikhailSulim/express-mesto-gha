const express = require('express');

const signinRouter = express.Router();
const { celebrate, Joi } = require('celebrate');

const { login } = require('../controllers/users');

signinRouter.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);

module.exports = signinRouter;
