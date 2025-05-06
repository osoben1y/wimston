export const successRes = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({ statusCode, message, data });
};
