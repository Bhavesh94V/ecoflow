/**
 * Request Validation Middleware using Joi
 */

const { AppError } = require("../utils/appError")

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    })

    if (error) {
      const errorMessage = error.details.map((d) => d.message).join(", ")
      return next(new AppError(errorMessage, 400))
    }

    req.body = value
    next()
  }
}

const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    })

    if (error) {
      const errorMessage = error.details.map((d) => d.message).join(", ")
      return next(new AppError(errorMessage, 400))
    }

    req.query = value
    next()
  }
}

const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    })

    if (error) {
      const errorMessage = error.details.map((d) => d.message).join(", ")
      return next(new AppError(errorMessage, 400))
    }

    req.params = value
    next()
  }
}

module.exports = { validate, validateQuery, validateParams }
