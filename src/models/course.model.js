import mongoose, { Schema, model } from "mongoose";

const courseSchema = new Schema(
  {
    title: {type: String, trim: true, required: true, unique: true},
    description: {type: String, trim: true, required: true},
    teacher_id: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  },
  { timestamps: true }
);

export const Course = model("Course", courseSchema);
