import { User } from "../models/index.js";
import { hashPass, comparePass} from "../utils/bcrypt.js";
import { successRes } from "../utils/succes-response.js";
import {errorResponse} from "../utils/error-response.js"
import { userValidation } from "../utils/user.validator.js";
import { generateOtp, verifyOTP } from "../utils/otp-generator.js"
import { generateToken } from "../utils/jwt.js";
import { cookie } from "../utils/cookie.js";
import {transporter} from "../utils/sendEmail.js"


export class TeacherController {
  async registerTeacher(req, res) {
    try {
      const { data } = userValidation(req.body);

      const { name, email, password } = data;

      const existsUser = await User.findOne({ email });

      if (existsUser) {
        return errorResponse(res, 409, `User already exists`);
      }

      const encodedPass = await hashPass(password);

      const newTeacher = await User.create({
        name,
        email,
        password: encodedPass,
        enrolledCourse_id: null,
        role: "teacher",
        otp_secret: null,
        otp_enabled: null,
      });

      const { token } = await generateOtp(newTeacher._id);
      await transporter(
        email,
        `Verify your email`,
        `Your otp code is: ${token}`
      );

      return successRes(
        res,
        201,
        "Teacher registered successfully",
        newTeacher._id
      );
    } catch (error) {
      return errorResponse(res, 500, error);
    }
  }

  async verifyOTP(req, res) {
    try {
      const { email, otp } = req.body;

      const existsTeacher = await User.findOne({ email });

      if (!existsTeacher) {
        return errorResponse(res, 404, `User not found`);
      }

      const isMatch = await verifyOTP(existsTeacher._id, otp);

      if (!isMatch) {
        return errorResponse(res, 401, `Invalid otp`);
      }

      return successRes(res, 200, `Teacher successfully verified`);
    } catch (error) {
      return errorResponse(res, 500, error);
    }
  }

  async loginTeacher(req, res) {
    try {
      const { email, password } = req.body;

      const existsTeacher = await User.findOne({ email });

      if (!existsTeacher) {
        return errorResponse(res, 404, `User not found`);
      }

      const isMatch = await comparePass(password, existsTeacher.password);

      if (!isMatch) {
        return errorResponse(res, 401, `Invalid password`);
      }

      const payload = {
        sub: existsTeacher._id,
        role: existsTeacher.role,
      };

      const token = generateToken(payload);
      const { accessToken, refreshToken } = token;
      cookie(res, refreshToken);

      return successRes(
        res,
        200,
        `Teacher logged in successfully`,
        accessToken
      );
    } catch (error) {
      return errorResponse(res, 500, error);
    }
  }

  async profileTeacher(req, res) {
    try {
      const { email, password } = req.body;

      const existsTeacher = await User.findOne({ email });

      if (!existsTeacher) {
        return errorResponse(res, 404, `User not found`);
      }

      const isMatch = await comparePass(password, existsTeacher.password);

      if (!isMatch) {
        return errorResponse(res, 401, `Invalid password`);
      }

      return successRes(res, 200, "success", existsTeacher);
    } catch (error) {
      return errorResponse(res, 500, error);
    }
  }
}
