require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');
const DefaultError = require('../errors/DefaultError');
const AuthError = require('../errors/AuthError');

const { NODE_ENV, JWT_SECRET } = process.env;

//  возвращает информацию о пользователе (email и имя)
const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Нет пользователя с таким id');
      }
      res.status(200).send(user);
    })
    .catch(next);
};

//  обновляет информацию о пользователе (email и имя)
const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    })
    .then((newUser) => {
      if (!newUser) {
        throw new NotFound('id пользователя не найден!');
      }
      res.status(200).send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(err.message));
      } else {
        next(err);
      }
    });
};

//  создаёт пользователя
const createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  return User.findOne({ email })
    .then((mail) => {
      if (mail) {
        throw new Conflict('Такой пользователь уже существует');
      }
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          throw new DefaultError('Ошибка на сервере');
        }
        User.create({ name, email, password: hash })
          .then((user) => {
            res.status(200).send({
              name: user.name,
              email: user.email,
            });
          });
      });
    })
    .catch(next);
};

// проверяет переданные в теле почту и пароль и возвращает JWT
const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new AuthError('Неверный логин или пароль');
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      return res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUser,
  updateUser,
  createUser,
  login,
};
