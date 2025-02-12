const { Joi, celebrate } = require('celebrate');
const validator = require('validator');

const validateURL = (value, helpers) => {
    if (validator.isURL(value)) {
      return value;
    }
    return helpers.error('string.uri');
  }

const validateEmail = (value,helpers) => {
    if (validator.isEmail(value)){
        return value;
    }
    return helpers.error('Invalid email');
}

const validateItem = (value,helpers) => {
    if(!validator.isHexadecimal(value) || value.length === 24){
        return value;
    }
    return helpers.error('Invalid ID format: must be a 24-character hexadecimal string')
}

const validateClothingItem = celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30).messages({
        "string.min": 'The minimum length of the "name" field is 2',
        "string.max": 'The maximum length of the "name" field is 30',
        "string.empty": 'The "name" field must be filled in',
      }),
  
      imageUrl: Joi.string().required().custom(validateURL).messages({
        "string.empty": 'The "imageUrl" field must be filled in',
        "string.uri": 'The "imageUrl" field must be a valid url',
      }),

      weather: Joi.string().valid('hot', 'warm', 'cold').required().messages({
        "any.only": 'The "weather" field must be one of the following: hot, warm, cold',
        "string.empty": 'The "weather" field must be filled in',
      })
    }),
  });

  const validateUserInfo = celebrate({
    body:Joi.object().keys({
        name:Joi.string().required().min(2).max(30).messages({
            "string.min": 'The minimum length of the "name" field is 2',
        "string.max": 'The maximum length of the "name" field is 30',
        }),
        avatar:Joi.string().custom(validateURL).required().message({
            "any.required": "Avatar URL is required.",
        }),
        email:Joi.string().custom(validateEmail).required().message({
            "any.required": "Email is required.",
        }),
        password:Joi.string().required().message({
            "any.required": "Password is required."
        }),

    }),
  })

  const validateUserLogin = celebrate({
    body:Joi.object().keys({
        email:Joi.string().custom(validateEmail).required().message({
            "any.required": "Email is required.",
        }),
        password:Joi.string().required().message({
            "any.required": "Password is required."
        }),
    }),
  });

  const validatedId = celebrate({
    params: Joi.object().keys({
    itemId: Joi.string().custom(validateItem).required().messages({
            'any.required': 'itemId is required.',
        }),
      }),
  })

  module.exports = {
    validateURL,
    validateEmail,
    validateItem,
    validateClothingItem,
    validateUserInfo,
    validateUserLogin,
    validatedId
  };
  