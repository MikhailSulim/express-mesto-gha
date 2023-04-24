// схема и модель данных о карточке для записи в БД
const mongoose = require("mongoose");

// создаём схему
const cardSchema = new mongoose.Schema(
  {
    name: {
      // имя карточки, строка от 2 до 30 символов, обязательное поле
      type: String,
      required: [true, "необходимо задать имя карточки"],
      minlength: [2, "длина имени карточки менее двух символов"],
      maxlength: [30, "длина имени карточки более 30 символа"],
    },
    link: {
      // ссылка на картинку, строка, обязательно поле
      type: String,
      required: [true, "необходимо задать ссылку на картинку"],
    },
    owner: {
      // ссылка на модель автора карточки, тип ObjectId, обязательное поле
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "необходимо задать ссылку на модель автора карточки"],
    },
    likes: {
      //список лайкнувших пост пользователей, массив ObjectId, по умолчанию — пустой массив (поле default)
      type: [mongoose.Schema.Types.ObjectId],
      ref: "user",
      default: [],
    },
    createdAt: {
      // дата создания, тип Date, значение по умолчанию Date.now
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

// создаём модель
module.exports = mongoose.model("card", cardSchema);
