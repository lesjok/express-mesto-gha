const jwt = require('jsonwebtoken');
const NotAuthError = require('../errors/notAuthError');

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(new NotAuthError('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    next(new NotAuthError('Необходима авторизация'));
    // eslint-disable-next-line consistent-return
    return;
  }

  req.user = payload;

  next();
};

module.exports = { auth };
