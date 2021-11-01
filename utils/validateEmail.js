const { isEmail } = require('validator');
const BadRequest = require('../errors/BadRequest');

module.exports = (value) => {
  const result = isEmail(value);
  if (result) {
    return value;
  }
  throw new BadRequest('Введена некорректная почта');
};
