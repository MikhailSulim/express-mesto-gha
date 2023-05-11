require('dotenv').config(); // для работы с переменными окружения в process.env

const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const mongoose = require('mongoose');

const userRouter = require('./routes/users');

const cardRouter = require('./routes/cards');
const auth = require('./middlewares/auth');

const { NOT_FOUND_CODE } = require('./utils/constants');
const { createUser } = require('./controllers/users');
const { login } = require('./controllers/users');

const { PORT, DB_URL } = require('./utils/config');

app.use(express.json()); // для взаимодействия с req.body, аналог body-parser
app.use(cookieParser()); // подключаем парсер кук как мидлвэр, для работы req.cookies

// временное решение авторизации
// app.use((req, res, next) => {
//   req.user = {
//     _id: '64445817784cf6eae5ec88bd', // вставьте сюда _id созданного в предыдущем пункте пользователя
//   };

//   next();
// });

mongoose.connect(DB_URL, {
  // useNewUrlParser: true,
}); // с новых версий не обязательно добавлять опции

app.use(userRouter);
app.use(cardRouter);

app.post('/signin', login);
app.post('/signup', createUser);

app.use('*', (req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: 'Запрашиваемый URL не существует' });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
