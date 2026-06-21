const claudeService = require('../services/claudeService');

// POST /api/ai/advisor
const getAdvisorAnalysis = async (req, res, next) => {
  try {
    const data = await claudeService.getAdvisorAnalysis();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// GET /api/ai/stream?medicine=Paracetamol
const streamAdvisorAnalysis = async (req, res, next) => {
  try {
    const medicine = (req.query.medicine || '').trim();
    await claudeService.streamAdvisorAnalysis(medicine, res);
  } catch (err) {
    // If headers already sent, just end
    if (!res.headersSent) next(err);
    else res.end();
  }
};

// POST /api/ai/symptom-check   body: { symptom }
const symptomCheck = async (req, res, next) => {
  try {
    const { symptom } = req.body;
    if (!symptom) return res.status(400).json({ success: false, error: 'Symptom required' });
    const suggestions = await claudeService.getSymptomSuggestions(symptom);
    res.json({ success: true, data: suggestions });
  } catch (err) {
    next(err);
  }
};

// POST /api/ai/chat   body: { messages: [{role, content}] }
const chat = async (req, res, next) => {
  try {
    const { messages } = req.body;
    if (!messages || !messages.length) {
      return res.status(400).json({ success: false, error: 'Messages array required' });
    }
    const reply = await claudeService.getChatResponse(messages);
    res.json({ success: true, data: { reply } });
  } catch (err) {
    next(err);
  }
};

// POST /api/ai/read-prescription  body: { image: "<base64>", mediaType: "image/jpeg" }
const readPrescription = async (req, res, next) => {
  try {
    const { image, mediaType = 'image/jpeg' } = req.body;
    if (!image) return res.status(400).json({ success: false, error: 'Image (base64) required' });
    const medicines = await claudeService.readPrescription(image, mediaType);
    res.json({ success: true, data: medicines });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAdvisorAnalysis, streamAdvisorAnalysis, symptomCheck, chat, readPrescription };
