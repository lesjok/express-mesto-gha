const jwt = require('jsonwebtoken');
const NotAuthError = require('../errors/notAuthError');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new NotAuthError('Необходима авторизация');
  }

  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    throw new NotAuthError('Необходима авторизация');
  }

  req.user = payload;

  next();
  return null;
};

module.exports = { auth };
