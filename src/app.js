import express from "express";
import cookieParser from "cookie-parser";

import { mongoDB } from "./config/db.js";
import { logger } from "./utils/logger/logger.js";
import { superAdminRouter } from "./routes/superadmin.routes.js"
import { userRouter } from "./routes/user.routes.js";
import { adminrouter } from "./routes/admin.routes.js";
import { teacherRouter } from "./routes/teacher.routes.js";
import {courseRouter} from "./routes/course.routes.js"
mongoDB();

const app = express();
const PORT = +process.env.PORT;

app.use('/user', userRouter)
app.use('/superAdmin', superAdminRouter)
app.use('/admin', adminrouter)
app.use('/course', courseRouter)
app.use('/teacher', teacherRouter)

app.use(express.json());
app.use(cookieParser());


process.on("uncaughtException", (err) => {
  if (err) console.log(`Uncaught exception:`, err);
  process.exit(1);
});

process.on("unhandledRejection", (ression) =>
  console.log(`Unhandled rejection:`, ression)
);

app.use((err, __, res, next) => {
  if (err) {
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  } else {
    next();
  }
});

app.listen(PORT, logger.info(`Server is running on port ${PORT}`));
