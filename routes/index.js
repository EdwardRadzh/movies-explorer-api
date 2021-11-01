const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const usersRouter = require('./users');
const movieRouter = require('./movies');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFound = require('../errors/NotFound');

//  роуты, не требующие авторизации
//  роут регистрации
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

//  роут логина
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

// авторизация
router.use(auth);

// роуты, требующие авторизации
router.use('/users', usersRouter);
router.use('/movies', movieRouter);
router.use('*', () => {
  throw new NotFound('Запрашиваемый ресурс не найден');
});

module.exports = router;
