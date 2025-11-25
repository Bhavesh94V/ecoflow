/**
 * Auth Validation Schemas
 */

const Joi = require("joi")

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({ "string.min": "Name must be at least 2 characters" }),
  email: Joi.string().email().required().messages({ "string.email": "Please provide a valid email" }),
  password: Joi.string().min(6).max(50).required().messages({ "string.min": "Password must be at least 6 characters" }),
  phone: Joi.string()
    .pattern(/^[+]?[\d\s()-]{10,20}$/)
    .optional()
    .messages({ "string.pattern.base": "Please provide a valid phone number" }),
  address: Joi.string().max(255).optional(),
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

module.exports = { registerSchema, loginSchema }
