import { Router } from "express";

import { TeacherController } from "../controller/teacher.controller.js";
import { jwtAuthGuard } from "../middleware/jwt.auth.guard.js";
import { selfAuthGuard } from "../middleware/self.auth.guard.js";
const router = Router();

const controller = new TeacherController();

router
  .post("/registerTeacher", jwtAuthGuard, selfAuthGuard, controller.registerTeacher)
  .post("/verifyTeacher", controller.verifyOTP)
  .post("/loginTeacher", controller.loginTeacher)
  .post("/profileTeacher", controller.profileTeacher);

export { router as teacherRouter };
