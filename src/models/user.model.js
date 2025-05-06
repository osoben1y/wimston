import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {type: String, trim: true, required: true},
    email: { type: String, trim: true, required: true, unique: true},
    password: {type: String, trim: true, required: true},
    enrolledCourse_id: {type: mongoose.Schema.Types.ObjectId, ref: "Course"},
    role: {type: String, enum: ["user", "admin", "superadmin", "teacher"]},
    otp_secret: {type: String},
    otp_enabled: {type: Boolean, default: false},
  },
  { timestamps: true }
);

export const User = model("User", userSchema);
