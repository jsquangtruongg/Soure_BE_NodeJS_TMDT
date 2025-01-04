import mongoose from "mongoose";
const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("CLOUDINARY_NAME:", process.env.MONGODB_URI);
    if (conn.connection.readyState === 1) {
      console.log("DB connection is successfully");
    } else {
      console.log("DB connecting");
    }
  } catch (error) {
    console.log("DB Connect failed");
    throw new Error(error);
  }
};
export default dbConnect;
