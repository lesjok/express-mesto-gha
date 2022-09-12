// eslint-disable-next-line no-unused-vars
const User = require('../models/user');
const STATUS_CODE = require('../errors/errors');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({
      _id: user._id,
      name,
      about,
      avatar,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(STATUS_CODE.dataError)
          .send({ message: 'Переданы некорректные данные при создании пользователя.' });
        return;
      }
      res
        .status(STATUS_CODE.serverError)
        .send({ message: 'Произошла ошибка на сервере. Повторите запрос' });
    });
};
const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(STATUS_CODE.success).send(users);
    })
    .catch(() => {
      res
        .status(STATUS_CODE.serverError)
        .send({ message: 'Произошла ошибка на сервере. Повторите запрос' });
    });
};
const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(STATUS_CODE.notFound).send({
          message: 'Пользователь по указанному id не найден.',
        });
        return;
      }
      res.status(STATUS_CODE.success).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res
          .status(STATUS_CODE.dataError)
          .send({ message: 'Данные некорректны' });
        return;
      }
      res.status(STATUS_CODE.serverError).send({
        message: 'Произошла ошибка на сервере. Повторите запрос',
      });
    });
};
const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findOneAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      if (!user) {
        res.status(STATUS_CODE.notFound).send({
          message: 'Пользователь по указанному id не найден.',
        });
        return;
      }
      res.send({
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(STATUS_CODE.dataError)
          .send({ message: 'Переданы некорректные данные.' });
      } else if (err.name === 'CastError') {
        res
          .status(STATUS_CODE.dataError)
          .send({ message: 'Данные некорректны' });
      } else {
        res
          .status(STATUS_CODE.serverError)
          .send({ message: 'Произошла ошибка на сервере. Повторите запрос' });
      }
    });
};
const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findOneAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      if (!user) {
        res.status(STATUS_CODE.notFound).send({
          message: 'Пользователь по указанному id не найден.',
        });
        return;
      }
      res.send({ _id: user._id, avatar: user.avatar });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(STATUS_CODE.dataError)
          .send({ message: 'Переданы некорректные данные.' });
      } else if (err.name === 'CastError') {
        res
          .status(STATUS_CODE.notFound)
          .send({ message: 'Пользователь с указанным id не найден.' });
      } else {
        res
          .status(STATUS_CODE.serverError)
          .send({ message: 'Произошла ошибка на сервере. Повторите запрос' });
      }
    });
};
module.exports = {
  createUser,
  getUser,
  getUsers,
  updateUser,
  updateAvatar,
};
