// eslint-disable-next-line no-unused-vars
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const STATUS_CODE = require('../errors/errors');
const ConflictError = require('../errors/conflictError');
const BadRequestError = require('../errors/badRequest');
const NotFound = require('../errors/notFound');

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestError('Данные некорректны'));
        } else if (err.code === 11000) {
          next(new ConflictError('Пользователь с данным email уже существует!'));
        } else {
          next(err);
        }
      });
  });
};
// eslint-disable-next-line consistent-return
const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(STATUS_CODE.dataError).send({ message: 'Ошибка!' });
  }
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(STATUS_CODE.notFound).send({ message: 'Неверная почта или пароль.' });
      }
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          httpOnly: true,
        });
      return res.status(STATUS_CODE.success).send({
        _id: user._id,
        email: user.email,
        avatar: user.avatar,
        name: user.name,
        about: user.about,
      });
    });
};
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFound());
      }
      return res.send(user);
    })
    .catch(next);
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
const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFound());
      }
      res.status(STATUS_CODE.success).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Данные некорректны'));
      } else {
        next(error);
      }
    });
};
const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findOneAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      if (!user) {
        next(new NotFound());
      }
      res.send({
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Данные некорректны'));
      } else {
        next(err);
      }
    });
};
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findOneAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      if (!user) {
        next(new NotFound());
      }
      res.send({ _id: user._id, avatar: user.avatar });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Данные некорректны'));
      } else {
        next(err);
      }
    });
};
module.exports = {
  createUser,
  getUser,
  getUsers,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser,
};
