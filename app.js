const express = require("express");
const app = express();
const { PORT = 3003 } = process.env;
console.log(process.env);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
