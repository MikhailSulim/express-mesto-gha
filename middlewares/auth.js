const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // const token = req.cookie.jwt;
  console.log(req.headers.cookie);
  const token = req.cookies.jwt;
  //


  // убеждаемся, что токен есть
  if (!token) {
    // return res.status(401).send({ message: 'Необходима авторизация' });
    return next(new Error({ message: 'Необходима авторизация' }));
  }

  let payload; // объявляем эту переменную, чтобы она была видна вне блока try

  // верифицируем токен
  try {
    // пытаемся это сделать
    payload = jwt.verify(token, 'some-secret-key');
  } catch (error) {
    // если не получилось
    // return res.status(401).send({ message: 'Необходима авторизация' });
    return next(new Error({ message: 'Необходима авторизация' }));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
