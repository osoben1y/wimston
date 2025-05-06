import { User } from "../models/index.js";
import { comparePass } from "../utils/bcrypt.js";
import { cookie } from "../utils/cookie.js";
import { errorResponse } from "../utils/error-response.js";
import { generateToken } from "../utils/jwt.js";
import { hashPass } from "../utils/bcrypt.js";
import { successRes } from "../utils/succes-response.js";
import { userValidation } from "../utils/user.validator.js";
import { jwtAuthGuard } from "../middleware/jwt.auth.guard.js";
import { superAdminGuard } from "../middleware/super.admin.guard.js";
import { router, controller } from "../routes/superadmin.routes.js";

export class SuperAdminController {
  async registerSuperAdmin(req, res) {
    try {
      const { data } = userValidation(req.body);

      const { name, email, password } = data;

      const existsSuperAdmin = await User.findOne({ role: "superadmin" });

      if (existsSuperAdmin) {
        return errorResponse(res, 409, `Superadmin already exists`);
      }
      const decodePass = await hashPass(password);

      const newSuperAdmin = await User.create({
        name,
        email,
        password: decodePass,
        role: "superadmin",
        enrolledCourse_id: null,
        otp_secret: null,
        otp_enabled: null,
      });

      return successRes(
        res,
        201,
        `Superadmin created successfully`,
        newSuperAdmin._id
      );
    } catch (error) {
      return errorResponse(res, 500, error);
    }
  }

  async loginSuperAdmin(req, res) {
    try {
      const { email, password } = req.body;

      const existsSuperAdmin = await User.findOne({ email });

      if (!existsSuperAdmin) {
        return errorResponse(res, 404, `Super admin not found`);
      }

      const isMatch = await comparePass(password, existsSuperAdmin.password);

      if (!isMatch) {
        return errorResponse(res, 401, `Invalid password`);
      }

      const payload = {
        sub: existsSuperAdmin._id,
        role: existsSuperAdmin.role,
      };

      const token = generateToken(payload);

      const { accessToken, refreshToken } = token;
      cookie(res, refreshToken);
      return successRes(
        res,
        200,
        `Super admin logged in successfully`,
        accessToken
      );
    } catch (error) {
      return errorResponse(res, 500, error);
    }
  }

  async profileSuperAdmin(req, res) {
    try {
      const { email, password } = req.body;

      const existsSuperAdmin = await User.findOne({ email });

      if (!existsSuperAdmin) {
        return errorResponse(res, 404, `Super admin not found`);
      }

      const isMatch = await comparePass(password, existsSuperAdmin.password);

      if (!isMatch) {
        return errorResponse(res, 401, `Invalid password`);
      }

      return successRes(res, 200, `Super admin profile`, existsSuperAdmin);
    } catch (error) {
      return errorResponse(res, 500, error);
    }
  }

  async getAllAdmins(__, res) {
    try {
      const allAdmins = await User.find({ role: "admin" });

      return successRes(res, 200, `success`, allAdmins);
    } catch (error) {
      return errorResponse(res, 500, error);
    }
  }

  async createAdmin(req, res) {
    try {
      const { data } = userValidation(req.body);

      const { name, email, password } = data;

      const existsAdmin = await User.findOne({ email });

      if (existsAdmin) {
        return errorResponse(res, 409, `Admin already exists`);
      }

      const encodedPass = await hashPass(password);

      const newAdmin = await User.create({
        name,
        email,
        password: encodedPass,
        role: "admin",
        enrolledCourse_id: null,
        otp_secret: null,
        otp_enabled: null,
      });

      return successRes(res, 201, "User registered successfully", newAdmin._id);
    } catch (error) {
      return errorResponse(res, 500, error);
    }
  }

  async updateAdminByID(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return errorResponse(res, 400, `ID not found`);
      }

      const admin = await User.findByIdAndUpdate(id, req.body, { new: true });

      if (!admin) {
        return errorResponse(res, 404, `Admin not found`);
      }

      return successRes(res, 200, "success", admin);
    } catch (error) {
      return errorResponse(res, 500, error);
    }
  }

  async deleteAdminByID(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return errorResponse(res, 400, `ID not found`);
      }

      const existsAdmin = await User.findById(id);

      if (!existsAdmin) {
        return errorResponse(res, 404, `Admin not found`);
      }

      await User.findByIdAndDelete(id);

      return successRes(res, 200, "Admin deleted successfully");
    } catch (error) {
      return errorResponse(res, 500, error);
    }
  }
}
router
  .post("/registerSuperAdmin", controller.registerSuperAdmin)
  .post("/loginSuperAdmin", controller.loginSuperAdmin)
  .post(
    "/profileSuperAdmin",
    jwtAuthGuard,
    superAdminGuard,
    controller.profileSuperAdmin
  )
  .post("/createAdmin", jwtAuthGuard, superAdminGuard, controller.createAdmin)
  .get("/admins", jwtAuthGuard, superAdminGuard, controller.getAllAdmins)
  .put("/admin/:id", jwtAuthGuard, superAdminGuard, controller.updateAdminByID)
  .delete(
    "/admin/:id",
    jwtAuthGuard,
    superAdminGuard,
    controller.deleteAdminByID
  );
