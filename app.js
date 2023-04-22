const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { PORT = 3000 } = process.env;
// console.log(process.env);

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// app.get("/users", (req, res) => {
//   res.send("fdgdfg");
// });

// app.get("/users/:id", (req, res) => {
//   const { id } = req.params;
//   console.log(req.params, typeof id);
//   res.send(req.params);
// });

// app.post("/users/", (req, res) => {
//   console.log(req);
//   res.send("dsfsdf");
// });

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
