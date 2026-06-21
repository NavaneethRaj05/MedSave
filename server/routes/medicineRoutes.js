const express    = require('express');
const router     = express.Router();
const { searchMedicine, getTrending, getGenericAlternatives } = require('../controllers/medicineController');

router.get('/search',       searchMedicine);
router.get('/trending',     getTrending);
router.get('/alternatives', getGenericAlternatives);

module.exports = router;
