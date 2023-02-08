const joi = require("joi");

const listValidationSchema = joi.object().keys({
  title: joi.string().max(30).required(),
  description: joi.string().required(),
  status: joi.boolean().required(),
});

const validateList = (request, response, next) => {
  const { title, description, status } = request.body;
  const { error } = listValidationSchema.validate({
    title,
    description,
    status,
  });
  if (error) {
    return response.status(422).json(error);
  } else {
    next();
  }
};

module.exports = validateList;
