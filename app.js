require('dotenv').config(); // для работы с переменными окружения в process.env

const express = require('express');
const cookieParser = require('cookie-parser'); // для парсинга кук

const app = express();
const mongoose = require('mongoose'); // подключение базы данных

const userRouter = require('./routes/users'); // подключение роутов пользователей
const cardRouter = require('./routes/cards'); // подключение роутов карточек

const auth = require('./middlewares/auth'); // подключение мидлвэр авторизации

const { createUser } = require('./controllers/users');
const { login } = require('./controllers/users');

const { PORT, DB_URL } = require('./utils/config');

const errorsHandler = require('./middlewares/errorsHandler'); // подключение для централизованной обработки ошибок
const NotFoundError = require('./errors/NotFoundError'); // кастомный класс ошибки

app.use(express.json()); // для взаимодействия с req.body, аналог body-parser
app.use(cookieParser()); // подключаем парсер кук как мидлвэр, для работы req.cookies

mongoose.connect(DB_URL, {
  // useNewUrlParser: true,
}); // с новых версий не обязательно добавлять опции

app.use(userRouter);
app.use(cardRouter);

app.post('/signin', login);
app.post('/signup', createUser);

app.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Запрашиваемый URL не существует'));
});

app.use(errorsHandler); // центр. обработка ошибок

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// TODO поставить и подключить helmet для безопасности
