// схема и модель данных о пользователе для записи в БД
const mongoose = require('mongoose');

// валидатор
const isEmail = require('validator/lib/isEmail');

// создаём схему
const userSchema = new mongoose.Schema(
  {
    name: {
      // имя пользователя, строка от 2 до 30 символов, обязательное поле
      type: String,
      default: 'Жак-Ив Кусто',
      minlength: [2, 'длина имени пользователя менее двух символов'],
      maxlength: [30, 'длина имени пользователя более 30 символа'],
    },
    about: {
      // информация о пользователе, строка от 2 до 30 символов, обязательное поле
      type: String,
      default: 'Исследователь',
      minlength: [2, 'длина описания пользователя менее двух символов'],
      maxlength: [30, 'длина описания пользователя более 30 символа'],
    },
    avatar: {
      // ссылка на аватарку, строка, обязательное поле
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      required: [true, 'необходимо задать логин пользователя'],
      unique: [true, 'необходимо уникальное значение логина'],
      validate: {
        validator: (email) => isEmail(email),
        message: 'это не адрес электронной почты',
      },
    },
    password: {
      type: String,
      required: [true, 'пароль должен быть обязательно'],
      minlength: [8, 'длина пароля должна быть не менее 8 символов'],
    },
  },
  { versionKey: false },
);
// метод findUserByCredentials, который принимает на вход два параметра — почту и пароль
// — и возвращает объект пользователя или ошибку.
userSchema.static.findUserByCredentials = function (email, password) {
// попытаемся найти пользователя по почте
// Функция findUserByCredentials не должна быть стрелочной.
// Это сделано, чтобы мы могли пользоваться this.
// Иначе оно было бы задано статически, ведь стрелочные функции запоминают значение this при объявлении.
// Осталось добавить обработку ошибки, когда хеши не совпадают.
// Опишем этот код в ещё одном обработчике then.

  return this.findOne({ email }) // this — это модель User
    .then((user) => {
  // не нашёлся — отклоняем промис
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

  // нашёлся — сравниваем хеши
  return bcrypt.compare(password, user.password).then(matched => {
    if (!matched) {
      return Promise.reject(new Error('Неправильные почта или пароль'));
    }
    return user;
  });
});

};

// создаём модель
module.exports = mongoose.model('user', userSchema);
