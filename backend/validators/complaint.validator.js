/**
 * Complaint Validation Schemas
 */

const Joi = require("joi")

const createComplaintSchema = Joi.object({
  message: Joi.string()
    .min(10)
    .max(1000)
    .required()
    .messages({ "string.min": "Complaint message must be at least 10 characters" }),
  bin_id: Joi.number().integer().positive().optional(),
  priority: Joi.string().valid("high", "medium", "low").default("medium"),
})

const assignComplaintSchema = Joi.object({
  complaint_id: Joi.number().integer().positive().required(),
  collector_id: Joi.number().integer().positive().required(),
})

const resolveComplaintSchema = Joi.object({
  complaint_id: Joi.number().integer().positive().required(),
  resolution_notes: Joi.string().max(500).optional(),
})

module.exports = { createComplaintSchema, assignComplaintSchema, resolveComplaintSchema }
