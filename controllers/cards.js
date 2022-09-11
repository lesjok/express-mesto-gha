const Card = require('../models/card');

const STATUS_CODE = require('../errors/errors');

const createCard = (req, res) => {
  const { name, link, owner = req.user._id } = req.body;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(STATUS_CODE.successCreate).send(card);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(STATUS_CODE.dataError).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
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
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(STATUS_CODE.notFound).send({
          message: 'Карточка с указанным id не найдена.',
        });
        return;
      }
      res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res
          .status(STATUS_CODE.dataError)
          .send({ message: 'Данные некорректны' });
      } else {
        res
          .status(STATUS_CODE.serverError)
          .send({ message: 'Произошла ошибка. Повторите запрос' });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(STATUS_CODE.notFound)
          .send({ message: 'Карточка с указанным id не найдена.' });
        return;
      }
      res.send({
        _id: card._id,
        name: card.name,
        link: card.link,
      });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res
          .status(STATUS_CODE.dataError)
          .send({ message: 'Переданы некорректные данные для добавления лайка.' });
      } else if (error.name === 'CastError') {
        res
          .status(STATUS_CODE.dataError)
          .send({ message: 'Карточка с указанным id не найдена.' });
      }
      res
        .status(STATUS_CODE.serverError)
        .send({ message: 'Произошла ошибка. Повторите запрос' });
    });
};
const deleteLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(STATUS_CODE.notFound).send({
          message: 'Карточка с указанным id не найдена.',
        });
        return;
      }
      res.send({
        _id: card._id,
        name: card.name,
        link: card.link,
      });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res
          .status(STATUS_CODE.dataError)
          .send({ message: 'Переданы некорректные данные для снятия лайка.' });
      } else if (error.name === 'CastError') {
        res
          .status(STATUS_CODE.dataError)
          .send({ message: 'Данные некорректны' });
      }
      res
        .status(STATUS_CODE.serverError)
        .send({ message: 'Произошла ошибка. Повторите запрос' });
    });
};
module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  deleteLikeCard,
};
