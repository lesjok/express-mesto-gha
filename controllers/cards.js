const Card = require('../models/card');
const ForbiddenError = require('../errors/forbidden');
const BadRequestError = require('../errors/badRequest');
const STATUS_CODE = require('../errors/errors');
const NotFound = require('../errors/notFound');

const createCard = (req, res, next) => {
  const { name, link, owner = req.user._id } = req.body;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(STATUS_CODE.successCreate).send(card);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Данные некорректны'));
      } else {
        res
          .status(STATUS_CODE.serverError)
          .send({ message: 'Произошла ошибка. Повторите запрос' });
      }
    });
};
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(STATUS_CODE.success).send(cards);
    })
    .catch(() => {
      res
        .status(STATUS_CODE.serverError)
        .send({ message: 'Произошла ошибка. Повторите запрос' });
    });
};
const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFound('Карточка не найдена.'));
      }
      res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res
          .status(STATUS_CODE.dataError)
          .send({ message: 'Данные некорректны' });
      } else {
        next(new ForbiddenError('Удалить данную карточку невозможно. Вы не являетесь ее создателем'));
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFound('Карточка не найдена.'));
      }
      res.send({
        _id: card._id,
        name: card.name,
        link: card.link,
      });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Данные некорректны'));
      } else {
        next(error);
      }
    });
};
const deleteLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFound('Карточка не найдена.'));
      }
      res.send({
        _id: card._id,
        name: card.name,
        link: card.link,
      });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Данные некорректны'));
      } else {
        next(error);
      }
    });
};
module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  deleteLikeCard,
};
