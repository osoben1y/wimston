import { Router } from "express";

import { UserController } from "../controller/user.controller.js";
import { jwtAuthGuard } from "../middleware/self.auth.guard.js";

const router = Router();

const controller = new UserController();

router
  .post("/register", controller.register)
  .post("/otp", controller.verifyOtp)
  .post("/login", controller.login)
  .post("/Token", controller.refreshToken)
  .post("/logout", controller.logout)
  .get("/courses", jwtAuthGuard, controller.getAllCourses)
  .get("/course/:id", jwtAuthGuard, controller.getCourseById);

export { router as userRouter };
