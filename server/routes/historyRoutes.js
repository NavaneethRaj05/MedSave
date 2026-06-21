const express = require('express');
const router  = express.Router();
const { getHistory, deleteHistory } = require('../controllers/historyController');

router.get('/',      getHistory);
router.delete('/:id', deleteHistory);

module.exports = router;
