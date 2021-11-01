const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validateEmail = require('../utils/validateEmail');

const {
  getUser,
  updateUser,
} = require('../controllers/users');

usersRouter.get('/users/me', getUser);

usersRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

module.exports = usersRouter;
