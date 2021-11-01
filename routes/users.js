const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const {
  getUser,
  updateUser,
} = require('../controllers/users');

usersRouter.get('/users/me', getUser);

usersRouter.patch('/users/me', celebrate({
  name: Joi.string().required().min(2).max(30),
  email: Joi.string().required().custom((value, helpers) => {
    if (validator.isUrl(value)) return value;
    return helpers.message('Неверный формат ссылки');
  }),
}), updateUser);

module.exports = usersRouter;
