const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateClothingItemBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2.',
      "string.max": 'The maximum length of the "name" field is 30.',
      "string.empty": 'The "name" field must be filled in.',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in.',
      "string.uri": 'The "imageUrl" field must be a valid URL.',
    }),
    weather: Joi.string().required().valid("hot", "warm", "cold").messages({
      "string.empty": 'The "weather" field must be filled in.',
    }),
  }),
});

const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2.',
      "string.max": 'The maximum length of the "name" field is 30.',
      "string.empty": 'The "name" field must be filled in.',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in.',
      "string.uri": 'The "avatar" field must be a valid URL.',
    }),
    email: Joi.string().required().email().messages({
      "string.email": 'The "e-mail" field must be an e-mail.',
      "string.empty": 'The "e-mail" field must be filled in.',
    }),
    password: Joi.string().required().min(8).messages({
      "string.empty": 'The "password" field must be filled in.',
      "string.min": 'The minimum length of the "password" field is 8.',
    }),
  }),
});

const validateNewUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2.',
      "string.max": 'The maximum length of the "name" field is 30.',
      "string.empty": 'The "name" field must be filled in.',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in.',
      "string.uri": 'The "avatar" field must be a valid URL.',
    }),
  }),
});

const validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.email": 'The "e-mail" field must be an e-mail.',
      "string.empty": 'The "e-mail" field must be filled in.',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in.',
    }),
  }),
});

const validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required().messages({
      "string.hex": "The item ID must be in hexadecimal format.",
      "string.length": "The item ID must be 24 characters long.",
    }),
  }),
});

const validateUserId = celebrate({
  body: Joi.object().keys({
    _id: Joi.string().hex().length(24).required().messages({
      "string.hex": "The user ID must be in hexadecimal format.",
      "string.length": "The user ID must be 24 characters long.",
    }),
  }),
});

module.exports = {
  validateClothingItemBody,
  validateUserBody,
  validateNewUserBody,
  validateAuthentication,
  validateItemId,
  validateUserId,
};
