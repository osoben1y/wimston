import { errorResponse } from "../utils/error-response.js";

export const selfAuthGuard = (req, res, next) => {
  try {
    const user = req.user;

    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return errorResponse(res, 403, `Access denied for role ${user.role}`);
    }

    next();
  } catch (error) {
    return errorResponse(res, 500, error);
  }
};
