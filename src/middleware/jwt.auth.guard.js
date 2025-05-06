import {errorResponse} from "../utils/error-response.js"
import verifyToken from "../utils/jwt.js"

export const jwtAuthGuard = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return errorResponse(res, 400, `Token header not found`);
    }

    const [type, token] = authHeader?.split(" ") || [];

    if (type !== "Bearer" || !token) {
      return errorResponse(res, 400, `Invalid or missing token`);
    }

    const { valid, expired, encode } = verifyToken(token);

    if (!valid) {
      return errorResponse(
        res,
        401,
        expired ? `Token expired` : `Token not defined`
      );
    }

    req.user = {
      sub: encode.sub,
      role: encode.role,
    };

    next();
  } catch (error) {
    return errorResponse(res, 500, error);
  }
};
