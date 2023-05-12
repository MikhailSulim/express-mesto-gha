const CODE_CREATED_201 = 201;
const CODE_BAD_REQUEST_400 = 400;
const CODE_UNAUTHORIZED_401 = 401;
const CODE_FORBIDDEN_403 = 403;
const CODE_NOT_FOUND_404 = 404;
const CODE_CONFLICT_409 = 409;
const REGEX_URL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

// /https?:\/\/w{0,3}\.?[\w0-9-]{1,10}\.\w{2,3}[\w\d\-._~:/?#[\]@!$&'()*+,;=]{0,}/m
// /https?:\/\/w{0,3}\.?[\w0-9-]{1,10}\.\w{2,3}[\w\d\-._~:/?#[\]@!$&'()*+,;=]{0,}/m

module.exports = {
  CODE_CREATED_201,
  CODE_BAD_REQUEST_400,
  CODE_UNAUTHORIZED_401,
  CODE_FORBIDDEN_403,
  CODE_NOT_FOUND_404,
  CODE_CONFLICT_409,
  REGEX_URL,
};
