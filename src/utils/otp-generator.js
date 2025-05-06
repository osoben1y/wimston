import speakeasy from "speakeasy";
import { User } from "../models/index.js";

export const generateOtp = async (userId) => {
  const secret = speakeasy.generateSecret({ length: 20 });

  await User.findByIdAndUpdate(userId, {
    otp_secret: secret.base32,
    otp_enabled: true,
  });

  const token = speakeasy.totp({
    secret: secret.base32,
    encoding: "base32",
  });

  return { token, secret: secret.base32 };
};

export const verifyOTP = async (userId, token) => {
  const user = await User.findById(userId);

  if (!user || !user.otp_secret) {
    return false;
  }

  const verified = speakeasy.totp.verify({
    secret: user.otp_secret,
    encoding: "base32",
    token,
    window: 1,
  });

  return verified;
};
