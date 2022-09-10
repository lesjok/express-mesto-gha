const router = require('express').Router();
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  deleteLikeCard,
} = require('../controllers/cards');

router.post('/', createCard);
router.get('/', getCards);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', deleteLikeCard);

module.exports = router;
