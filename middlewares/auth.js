const jwt = require('jsonwebtoken');
const NotAuthError = require('../errors/notAuthError');

const auth = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    next(new NotAuthError('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(token, 'secret-code');
  } catch (err) {
    next(new NotAuthError('Необходима авторизация'));
    return;
  }

  req.user = payload;

  next();
};

module.exports = { auth };
