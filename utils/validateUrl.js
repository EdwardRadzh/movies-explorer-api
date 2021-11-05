const { isURL } = require('validator');
const BadRequest = require('../errors/BadRequest');

module.exports = (value) => {
  const result = isURL(value, { require_protocol: true });
  if (result) {
    return value;
  }
  throw new BadRequest('Введена некорректная ссылка');
};
