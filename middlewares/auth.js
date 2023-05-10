const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log(req.cookies);

  // убеждаемся, что токен есть
  if (!token) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  let payload; // объявляем эту переменную, чтобы она была видна вне блока try

  // верифицируем токен
  try {
    // пытаемся это сделать
    payload = jwt.verify(token, 'some-secret-key');
  } catch (error) {
    // если не получилось
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
