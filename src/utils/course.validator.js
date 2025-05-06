import Joi from "joi";


const course = Joi.object({
  title: Joi.string().min(4).max(30).required(),
  description: Joi.string().min(5).required(),
  teacher_id: Joi.string().required(),
});

export const courseValidation = (data) => {
    const { error, value } = course.validate(data);
    return { error, value };

};

