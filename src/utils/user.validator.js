import Joi from "joi"


const user = Joi.object({
  name: Joi.string().min(5).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(15).required(),
  enrolledCourse_id: Joi.string().optional(),
  role: Joi.valid("user", "admin", "superadmin", "teacher").optional(),
  otp_secret: Joi.string().optional(),
  otp_enabled: Joi.boolean().default(false),
});

export const userValidation = (data) => {
  const { error, value } = user.validate(data);
  return { error, value };
};
