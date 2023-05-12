const { CODE_NOT_FOUND_404 } = require('../utils/constants');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CODE_NOT_FOUND_404;
  }
}

module.exports = NotFoundError;
