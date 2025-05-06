import { Router } from "express";

import { SuperAdminController } from "../controller/super.admin.controller.js";
import { jwtAuthGuard } from "../middleware/jwt.auth.guard.js";
import { selfAuthGuard } from "../middleware/self.auth.guard.js";
import { superAdminGuard } from "../middleware/super.admin.guard.js";


const router = Router();

const controller = new SuperAdminController();

router
  .post("/registerSuperAdmin", controller.registerSuperAdmin)
  .post("/loginSuperAdmin", controller.loginSuperAdmin)
  .post("/profileSuperAdmin", jwtAuthGuard, superAdminGuard, controller.profileSuperAdmin)
  .post("/createAdmin", jwtAuthGuard, superAdminGuard, controller.createAdmin)
  .get("/admins", jwtAuthGuard, superAdminGuard, controller.getAllAdmins)
  .put("/admin/:id", jwtAuthGuard, superAdminGuard, controller.updateAdminByID)
  .delete("/admin/:id", jwtAuthGuard,superAdminGuard, controller.deleteAdminByID
  );

export default router;
