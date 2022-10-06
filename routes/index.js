const routes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('../controllers/users');
const routerUsers = require('./users');
const routerCards = require('./cards');
const { regExp } = require('../regularExpression');

routes.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
routes.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regExp),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
routes.use('/users', routerUsers);
routes.use('/cards', routerCards);

module.exports = { routes };
