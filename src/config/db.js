import { connect } from "mongoose";

export const connectDB = () => {
  try {
    connect(process.env.MONGO_URI);
    console.log(`Mongo not connected`);
  } catch (error) {
    console.error(`Error in connecting mongo`);
  }
};
