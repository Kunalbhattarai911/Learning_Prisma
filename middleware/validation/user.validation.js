import Joi from "joi";

export const userRegisterValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(500).json({
      message: "Bad Request",
      error: error.message,
      success: false,
    });
  }
  next();
};


export const userUpdateValidation = (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string(),
    });
  
    const { error } = schema.validate(req.body);
  
    if (error) {
      return res.status(500).json({
        message: "Bad Request",
        error: error.message,
        success: false,
      });
    }
    next();
  };
