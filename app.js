const express = require("express");
const app = express();
const mongoose = require("mongoose");

const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");
const { PORT = 3000 } = process.env;

app.use(express.json()); // для взаимодействия с req.body, аналог body-parser

app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {
  // useNewUrlParser: true,
}); // с новых версий не обязательно добавлять опции



app.use(userRouter);
app.use(cardRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
