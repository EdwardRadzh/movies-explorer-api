require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
// const bodyParser = require('body-parser');
const limiter = require('./utils/rateLimiter');
const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const handleErrors = require('./middlewares/errorHandler');

const { PORT = 3001, MONGO_URL = 'mongodb://localhost:27017/moviesdb' } = process.env;

const app = express();

const allowedCors = [
  'localhost:3001',
  'http://localhost:3001',
  'https://movie-radzhabov.nomoredomains.rocks',
  'http://movie-radzhabov.nomoredomains.rocks',
];

// eslint-disable-next-line consistent-return
app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);

    return res.status(200).send();
  }

  next();
});

app.use(requestLogger);

app.use(helmet());
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect(MONGO_URL);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(handleErrors);

app.listen(PORT, () => PORT);
