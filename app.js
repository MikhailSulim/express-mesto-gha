const express = require("express");
const app = express();
const mongoose = require("mongoose");

const userRouter = require("./routes/users");
const { PORT = 3000 } = process.env;

app.use(express.json()); // для взаимодействия с req.body, аналог body-parser

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});



app.use(userRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
