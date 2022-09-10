/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const STATUS_CODE = require('./errors/errors');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  console.log({
    body: req.body,
  });
  next();
});

app.use((req, res, next) => {
  req.user = {
    _id: '631abda7afdb62b030e665aa',
  };
  next();
});

app.use('/users', routerUsers);
app.use('/cards', routerCards);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use('*', (req, res) => {
  res.status(STATUS_CODE.notFound).send({ message: 'Страница не найдена' });
});

app.listen(3000, () => {
  console.log('Сервер запущен');
});
