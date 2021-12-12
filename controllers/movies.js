const Movie = require('../models/movie');

// const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
// const Forbidden = require('../errors/Forbidden');

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
  // const { movieId } = req.params.movieId;
  // const owner = req.user._id;

  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (movie.owner._id.toString() === req.user._id) {
        Movie.findByIdAndRemove(req.params.movieId)
          .then(() => res.status(200).send({ message: 'Фильм успешно удален' }));
      } else {
        throw new Error('AccessError');
      }
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
