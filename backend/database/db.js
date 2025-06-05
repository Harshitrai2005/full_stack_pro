import mongoose from "mongoose";

mongoose.set('strictQuery', true);

export const connectDB = () => {
  mongoose.connect(
    "PASTE_YOUR_MONGO_DB_URL"
  )
    .then(() => {
      console.log(" Database connected successfully");
    })
    .catch((err) => {
      console.error(" Error connecting to the database", err.message);
    });
};
