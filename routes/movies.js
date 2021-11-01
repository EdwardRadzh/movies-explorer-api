const movieRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

// возвращает все сохранённые пользователем фильмы
movieRouter.get('/movies', getMovies);

// создаёт фильм
movieRouter.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isUrl(value)) return value;
      return helpers.message('Неверный формат ссылки');
    }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (validator.isUrl(value)) return value;
      return helpers.message('Неверный формат ссылки');
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isUrl(value)) return value;
      return helpers.message('Неверный формат ссылки');
    }),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.number().required(),
  }),
}), createMovie);

// удаляет сохранённый фильм
movieRouter.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
}), deleteMovie);

module.exports = movieRouter;
