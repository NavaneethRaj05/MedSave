const Joi = require('joi');

const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    if (error) {
      const details = error.details.map((d) => d.message).join(', ');
      return res.status(400).json({ success: false, error: details });
    }
    next();
  };
};

// Schemas
const schemas = {
  searchQuery: Joi.object({ q: Joi.string().min(2).max(100).required() }),
  alertCreate: Joi.object({
    medicineName: Joi.string().min(2).max(100).required(),
    targetPrice:  Joi.number().positive().required(),
    email:        Joi.string().email().optional().allow(''),
  }),
  symptomCheck: Joi.object({ symptom: Joi.string().min(3).max(200).required() }),
  chatMessage:  Joi.object({ messages: Joi.array().min(1).required() }),
};

module.exports = { validateRequest, schemas };
