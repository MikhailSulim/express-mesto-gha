const express = require('express');

const app = express();
const mongoose = require('mongoose');

const userRouter = require('./routes/users');

const cardRouter = require('./routes/cards');
const auth = require('./middlewares/auth');

const { NOT_FOUND_CODE } = require('./utils/constants');
const { createUser } = require('./controllers/users');
const { login } = require('./controllers/users');

const { PORT = 3000 } = process.env;

app.use(express.json()); // для взаимодействия с req.body, аналог body-parser

// временное решение авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '64445817784cf6eae5ec88bd', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
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
