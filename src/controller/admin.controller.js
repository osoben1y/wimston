import { User } from "../models/index.js";

import {comparePass, cookie, catchError, generateToken, successRes} from "../utils/index.js";

export class AdminController {
  async loginAdmin(req, res) {
    try {
      const { email, password } = req.body;

      const existsAdmin = await User.findOne({ email });

      if (!existsAdmin) {
        return errorResponse(res, 404, 'Admin not found');
      }

      const isMatch = await comparePass(password, existsAdmin.password);

      if (isMatch) {
        return errorResponse(res, 401, 'Invalid password');
      }

      const payload = {
        sub: existsAdmin._id,
        role: existsAdmin.role,
      };

      const token = generateToken(payload);

      const { accessToken, refreshToken } = token;
      cookie(res, refreshToken);
      return successRes(res, 200, 'Admin logged in successfully', accessToken);
    } catch (error) {
      return errorResponse(res, 500, error);
    }
  }

  async profileAdmin(req, res) {
    try {
      const { email, password } = req.body;

      const existsAdmin = await User.findOne({ email });

      if (!existsAdmin) {
        return errorResponse(res, 404, 'Admin not found');
      }

      const isMatch = await comparePass(password, existsAdmin.password);

      if (!isMatch) {
        return errorResponse(res, 401, 'Invalid password');
      }

      return successRes(res, 200, 'Admin profile', existsAdmin);
    } catch (error) {
      return errorResponse(res, 500, error);
    }
  }

  async getAllUsers(__, res) {
    try {
      const allUsers = await User.find({ role: "user" });

      return successRes(res, 200, 'success', allUsers);
    } catch (error) {
      return errorResponse(res, 500, error);
    }
  }

  async getTeacherById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return errorResponse(res, 400, 'ID not found');
      }

      const existsTeacher = await User.findById(id);

      if (existsTeacher || existsTeacher.role === "teacher") {
        return successRes(res, 200, 'success', existsTeacher);
      }

      return errorResponse(res, 403, 'Teacher not found or Invalid role');
    } catch (error) {
      return errorResponse(res, 500, error);
    }
  }

  async updateUserByID(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return errorResponse(res, 400, 'ID not found');
      }

      const user = await User.findByIdAndUpdate(id, req.body, { new: true });

      if (!user) {
        return errorResponse(res, 404, 'User not found');
      }
      return successRes(res, 200, "success", user);
    } catch (error) {
      return errorResponse(res, 500, error);
    }
  }

  async deleteUserByID(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return errorResponse(res, 400, 'ID not found');
      }

      const existsUser = await User.findById(id);

      if (!existsUser) {
        return errorResponse(res, 404, 'User not found');
      }

      await User.findByIdAndDelete(id);

      return successRes(res, 200, "User deleted successfully");
    } catch (error) {
      return errorResponse(res, 500, error);
    }
  }
}
