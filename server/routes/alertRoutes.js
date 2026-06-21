const express = require('express');
const router  = express.Router();
const { createAlert, listAlerts, deleteAlert } = require('../controllers/alertController');

router.post('/',     createAlert);
router.get('/',      listAlerts);
router.delete('/:id', deleteAlert);

module.exports = router;
