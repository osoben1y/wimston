import { Course, User } from "../models/index.js";
import { comparePass, hashPass } from "../utils/bcrypt.js";
import { cookie } from "../utils/cookie.js";
import {errorResponse} from "../utils/error-response.js"
import { generateOtp, generateToken } from "../utils/otp-generator.js";
import { successRes } from "../utils/succes-response.js";
import { transporter } from "../utils/sendEmail.js";
import { userValidation } from "../utils/user.validator.js";
import { verifyOTP } from "../utils/otp-generator.js";
import { verifyToken } from "../utils/jwt.js";


export class UserController {
  async register(req, res) {
    try {
      const { data } = userValidation(req.body);

      const { name, email, password, enrolledCourse_id } = data;

      const existsUser = await User.findOne({ email });

      if (existsUser) {
        return errorResponse(res, 409, `User already exists`);
      }

      const encodedPass = await hashPass(password);

      const newUser = await User.create({
        name,
        email,
        password: encodedPass,
        enrolledCourse_id,
        role: "user",
        otp_secret: null,
        otp_enabled: false,
      });

      const { token } = await generateOtp(newUser.id);
      await transporter(
        email,
        `Verify your email`,
        `Your otp code is: ${token}`
      );

      return successRes(
        res,
        201,
        "User registered successfully, OTP sent to email",
        newUser._id
      );
    } catch (error) {
      return errorResponse(res, 500, error);
    }
  }

  async verifyOtp(req, res) {
    try {
      const { email, otp } = req.body;

      const existsUser = await User.findOne({ email });

      if (!existsUser) {
        return errorResponse(res, 404, `User not found`);
      }

      const isVerified = await verifyOTP(existsUser.id, otp);

      if (!isVerified) {
        return errorResponse(res, 401, `Invalid otp`);
      }

      return successRes(res, 200, "User successfully registered");
    } catch (error) {
      return errorResponse(res, 500, error);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const existsUser = await User.findOne({ email });

      if (!existsUser) {
        return errorResponse(res, 404, `User not found`);
      }

      const isMatch = await comparePass(password, existsUser.password);

      if (!isMatch) {
        return errorResponse(res, 401, `Invalid password`);
      }

      const payload = {
        sub: existsUser._id,
        role: "user",
      };

      const token = generateToken(payload);

      const { accessToken, refreshToken } = token;
      cookie(res, refreshToken);

      return successRes(res, 200, "success", accessToken);
    } catch (error) {
      return errorResponse(res, 500, error);
    }
  }

  async refreshToken(req, res) {
    try {
      const refreshtoken = req.cookies.refreshToken;

      if (!refreshtoken) {
        return errorResponse(res, 401, `Refresh token not found`);
      }

      const decodedToken = verifyToken(refreshtoken);
      const { valid, expired, encode } = decodedToken;

      if (!valid) {
        return errorResponse(
          res,
          401,
          expired ? `Refresh Token expired` : "Invalid token"
        );
      }

      const payload = {
        sub: encode.sub,
        role: encode.role,
      };

      const token = generateToken(payload);

      const { accessToken, refreshToken } = token;
      cookie(res, refreshToken);

      return successRes(res, 200, "success", accessToken);
    } catch (error) {
      return errorResponse(res, 500, error);
    }
  }

  async logout(req, res) {
    try {
      const refreshtoken = req.cookies.refreshToken;

      if (!refreshtoken) {
        return errorResponse(res, 401, `Refresh token not found`);
      }

      const decodedToken = verifyToken(refreshtoken);
      const { valid, expired } = decodedToken;

      if (!valid) {
        return errorResponse(
          res,
          401,
          expired ? `Refresh Token expired` : "Invalid token"
        );
      }
      res.clearCookie("refreshToken");

      return successRes(res, 200, "Logout successfully");
    } catch (error) {
      return errorResponse(res, 500, error);
    }
  }

  async getAllCourses(req, res) {
    try {
      const user = req.user;

      if (!user) {
        return errorResponse(res, 401, `User not found`);
      }

      const existsCourses = await User.findById(user.sub).populate(
        "enrolledCourse_id"
      );

      if (!existsCourses) {
        return errorResponse(res, 404, `Course not found`);
      }

      return successRes(res, 200, `success`, existsCourses);
    } catch (error) {}
  }

  async getCourseById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return errorResponse(res, 400, `ID not found`);
      }

      const course = await Course.findById(id);

      if (!course) {
        return errorResponse(res, 404, `Course not found`);
      }

      return successRes(res, 200, "success", course);
    } catch (error) {
      return errorResponse(res, 500, error);
    }
  }
}
