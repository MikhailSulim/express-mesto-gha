const { CODE_UNAUTHORIZED_401 } = require('../utils/constants');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CODE_UNAUTHORIZED_401;
  }
}

module.exports = UnauthorizedError;
