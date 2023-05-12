const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../utils/config');

// импорт кастомного класса ошибки
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  // убеждаемся, что токен есть
  if (!token) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  let payload; // объявляем эту переменную, чтобы она была видна вне блока try

  // верифицируем токен
  try {
    // пытаемся это сделать
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // если не получилось
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
