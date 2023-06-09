// централизованная обработка ошибок

/* Код обработки ошибок дублируется в разных местах.
Если мы решим поменять формат возвращаемой ошибки,
например, добавить в JSON ещё какое-то поле,
нам придётся исправлять код несколько раз.
Чтобы избежать этого, принято обрабатывать ошибки централизованно
с помощью такого мидлвэра.  */

const errorsHandler = (err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    // проверяем статус и выставляем сообщение в зависимости от него
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
};

module.exports = errorsHandler;
