require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
// const bodyParser = require('body-parser');
const limiter = require('./utils/rateLimiter');
const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3001, MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

const app = express();

app.use(requestLogger);

app.use(helmet());
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect(MONGO_URL);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { message, statusCode = 500 } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Произошла ошибка на сервере'
        : message,
    });
  next();
});

app.listen(PORT, () => PORT);
