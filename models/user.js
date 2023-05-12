// схема и модель данных о пользователе для записи в БД
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// валидаторы
const isEmail = require('validator/lib/isEmail');
const isUrl = require('validator/lib/isURL');

// импорт кастомного класса ошибки
const UnauthorizedError = require('../errors/UnauthorizedError');

// создаём схему
const userSchema = new mongoose.Schema(
  {
    name: {
      // имя пользователя, строка от 2 до 30 символов, обязательное поле
      type: String,
      minlength: [2, 'длина имени пользователя менее двух символов'],
      maxlength: [30, 'длина имени пользователя более 30 символа'],
      default: 'Жак-Ив Кусто',
    },
    about: {
      // информация о пользователе, строка от 2 до 30 символов, обязательное поле
      type: String,
      minlength: [2, 'длина описания пользователя менее двух символов'],
      maxlength: [30, 'длина описания пользователя более 30 символа'],
      default: 'Исследователь',
    },
    avatar: {
      // ссылка на аватарку, строка, обязательное поле
      type: String,
      validate: {
        validator: (avatar) => isUrl(avatar),
        message: 'ссылка на аватар не валидна',
      },
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
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
      select: false, // отключить выбор для передачи в res
    },
  },
  {
    toJSON: { useProjection: true },
    toObject: { useProjection: true },
    versionKey: false,
  }, // отключение оправления пароля при регистрации и создания поля _v
);

// метод findUserByCredentials
userSchema.statics.findUserByCredentials = function (email, password) {
  // принимает на вход два параметра — почту и пароль, возвращает объект пользователя или ошибку.
  /* Функция findUserByCredentials не должна быть стрелочной.
   Это сделано, чтобы мы могли пользоваться this. */

  // попытаемся найти пользователя по почте
  return this.findOne({ email }) // this — это модель User
    .select('+password')
    .then((user) => {
      // не нашёлся — отклоняем промис
      if (!user) {
        return Promise.reject(
          new UnauthorizedError('Неправильные почта или пароль'),
        );
      }
      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError('Неправильные почта или пароль'),
          );
        }
        return user;
      });
    });
};

// создаём модель
module.exports = mongoose.model('user', userSchema);
