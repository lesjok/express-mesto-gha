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
        next(error);
      }
    });
};
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((result) => {
      if (!result) {
        throw new NotFound('Карточка не найдена.');
      }
      if (!result.owner.equals(req.user._id)) {
        throw new ForbiddenError();
      }

      Card.findByIdAndRemove(req.params.cardId)
        .then((card) => {
          if (!card) {
            throw new ForbiddenError();
          }
          res.send({ data: card });
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new BadRequestError());
            return;
          }
          next(err);
        });
    })
    .catch(next);
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
      } else {
        res.send({
          _id: card._id,
          name: card.name,
          link: card.link,
        });
      }
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
      } else {
        res.send({
          _id: card._id,
          name: card.name,
          link: card.link,
        });
      }
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
