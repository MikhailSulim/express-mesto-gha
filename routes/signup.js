const express = require('express');

const signupRouter = express.Router();
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');

const { createUser } = require('../controllers/users');

const { REGEX_URL } = require('../utils/constants');

signupRouter.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(REGEX_URL),
    }),
  }),
  createUser,
);

module.exports = signupRouter;
