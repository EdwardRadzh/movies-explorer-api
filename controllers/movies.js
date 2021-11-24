const Movie = require('../models/movie');

const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');

//  возвращает все сохранённые пользователем фильмы
const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch(next);
};

//  создаёт фильм с переданными в теле полями
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => {
      res.status(200).send(movie);
    })
    .catch(next);
};

//  удаляет сохранённый фильм по id
const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const owner = req.user._id;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        return next(new NotFound('Фильм с таким id не найден'));
      }
      if (owner !== String(movie.owner)) {
        return next(new Forbidden('Недостаточно прав для удаления'));
      }
      return Movie.findOneAndDelete({ movieId })
        .then(() => res.status(200).send({ message: `'${movie.nameRU}' удалён из личного кабинета` }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
