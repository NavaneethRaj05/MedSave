const express  = require('express');
const router   = express.Router();
const { aiLimiter } = require('../middleware/rateLimiter');
const {
  getAdvisorAnalysis,
  streamAdvisorAnalysis,
  symptomCheck,
  chat,
  readPrescription,
} = require('../controllers/aiController');

router.use(aiLimiter);

router.post('/advisor',             getAdvisorAnalysis);
router.get('/stream',               streamAdvisorAnalysis);
router.post('/symptom-check',       symptomCheck);
router.post('/chat',                chat);
router.post('/read-prescription',   readPrescription);

module.exports = router;
