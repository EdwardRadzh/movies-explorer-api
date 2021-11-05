// централизованный обработчик ошибок

const handleErrors = (err, req, res, next) => {
  const { message, statusCode = 500 } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Произошла ошибка на сервере'
        : message,
    });
  next();
};

module.exports = handleErrors;
