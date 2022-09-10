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
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(STATUS_CODE.notFound).send({
          message: 'Карточка или пользователь не найден.',
        });
      } else {
        res
          .status(STATUS_CODE.serverError)
          .send({ message: 'Произошла ошибка. Повторите запрос' });
      }
    });
};
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new Error();
    })
    .then((card) => res.send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res
          .status(STATUS_CODE.notFound)
          .send({ message: 'Карточка с указанным _id не найдена.' });
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
    { new: true },
  )
    .orFail(() => {
      throw new Error();
    })
    .then((card) => {
      res.status(STATUS_CODE.success).send(card);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(STATUS_CODE.dataError).send({
          message: 'Переданы некорректные данные для постановки лайка.',
        });
      } else if (error.name === 'NotFound') {
        res
          .status(STATUS_CODE.notFound)
          .send({ message: 'Передан несуществующий id карточки.' });
      } else {
        res
          .status(STATUS_CODE.serverError)
          .send({ message: 'Произошла ошибка. Повторите запрос' });
      }
    });
};
const deleteLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error();
    })
    .then((card) => {
      res.status(STATUS_CODE.success).send(card);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(STATUS_CODE.dataError).send({
          message:
            'Переданы некорректные данные для снятии лайка.',
        });
      } else if (error.name === 'NotFound') {
        res
          .status(STATUS_CODE.notFound)
          .send({ message: 'Передан несуществующий _id карточки.' });
      } else {
        res
          .status(STATUS_CODE.serverError)
          .send({ message: 'Произошла ошибка. Повторите запрос' });
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
