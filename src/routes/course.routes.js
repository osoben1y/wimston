import { Router } from "express";
import { CourseController } from "../controller/course.controller.js"
import { jwtAuthGuard } from "../middleware/jwt.auth.guard.js"
import { selfAuthGuard } from "../middleware/self.auth.guard.js"

const router = Router();
const controller = new CourseController();

router
    .get("/courses", controller.getAll)
    .post("/create-course", controller.create)
    .put("/courseUpdate/:id", controller.updateCourseById)
    .delete('/course/:id', controller.deleteCourseById);

export default router;