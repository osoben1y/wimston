import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;
const accessTokenExpire = process.env.ACCESS_TOKEN_TIME;
const refreshTokenExpire = process.env.REFRESH_TOKEN_TIME;

export const generateToken = (payload) => {
  try {
    const accessToken = jwt.sign(payload, secret, {
      expiresIn: accessTokenExpire,
    });
    const refreshToken = jwt.sign(payload, secret, {
      expiresIn: refreshTokenExpire,
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error(`Error generating token:, ${error}`);
  }
};

export const verifyToken = (token) => {
  try {
    const encode = jwt.verify(token, secret);
    return {
      valid: true,
      expired: false,
      encode,
    };
  } catch (error) {
    return {
      valid: false,
      expired: true,
      encode: null,
    };
  }
};
