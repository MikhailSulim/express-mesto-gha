const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../utils/config');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  // убеждаемся, что токен есть
  if (!token) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  let payload; // объявляем эту переменную, чтобы она была видна вне блока try

  // верифицируем токен
  try {
    // пытаемся это сделать
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    // если не получилось
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
