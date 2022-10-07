const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const errorMessage = require('./errors/errorMessage');
const NotFound = require('./errors/notFound');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(cookieParser());
app.use('/', require('./routes'));

app.use(auth);
app.use('/users', routerUsers);
app.use('/cards', routerCards);

app.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена.'));
});
app.use(errors());
app.use(errorMessage);
app.listen(3000, () => {
  console.log('Сервер запущен');
});
