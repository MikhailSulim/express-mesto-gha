
const userData = [
  {
    name: "Тестовый пользователь",
    about: "Информация о себе",
    avatar:
      "https://pictures.s3.yandex.net/resources/Screen_Shot_2019-09-25_at_18.26.07_1643789068.png",
  },
];

const getUsers = (req, res) => {
  res.send(userData);
};

const getUser = (req, res) => {
  const { id } = req.params;
  console.log(req.params, typeof id);
  res.send(req.params);
};

const createUser = (req, res) => {
  // console.log(req.body);
  const { name, about, avatar } = req.body;
  res.send(name);
  const user = {
    name,
    about,
    avatar,
  };
  userData.push(user);
};

module.exports = {getUsers, getUser, createUser};