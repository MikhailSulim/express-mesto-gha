require('dotenv').config(); // для работы с переменными окружения в process.env

const express = require('express');
const cookieParser = require('cookie-parser'); // для парсинга кук

const app = express();
const mongoose = require('mongoose'); // подключение базы данных

const { errors } = require('celebrate'); // мидлвэр ошибки

// безопасность
const helmet = require('helmet');

const limiter = require('./middlewares/limiter');

const signinRouter = require('./routes/signin');
const signupRouter = require('./routes/signup');
const userRouter = require('./routes/users'); // подключение роутов пользователей
const cardRouter = require('./routes/cards'); // подключение роутов карточек

const auth = require('./middlewares/auth'); // подключение мидлвэр авторизации

// const { createUser } = require('./controllers/users');
// const { login } = require('./controllers/users');

const { PORT, DB_URL } = require('./utils/config');

const errorsHandler = require('./middlewares/errorsHandler'); // подключение для централизованной обработки ошибок
const NotFoundError = require('./errors/NotFoundError'); // кастомный класс ошибки

app.use(express.json()); // для взаимодействия с req.body, аналог body-parser
app.use(cookieParser()); // подключаем парсер кук как мидлвэр, для работы req.cookies

mongoose.connect(DB_URL, {
  // useNewUrlParser: true,
}); // с новых версий не обязательно добавлять опции

// мидлвэры безопасности
app.use(helmet()); // для автоматической проставки заголовков безопасности
app.use(limiter); // для предотвращения ddos атак, ограничитель запросов

// роуты
app.use('/', signinRouter);
app.use('/', signupRouter);
// app.post('/signin', login);
// app.post('/signup', createUser);

// app.use(auth);

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);

app.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Запрашиваемый URL не существует'));
});

app.use(errors()); // обработка ошибок celebrate
/* будет обрабатывать только ошибки, которые сгенерировал celebrate.
Все остальные ошибки он передаст дальше,
где их перехватит централизованный обработчик. */
app.use(errorsHandler); // центр. обработка ошибок

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
