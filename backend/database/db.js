import mongoose from "mongoose";

mongoose.set('strictQuery', true);

export const connectDB = () => {
  mongoose.connect(
    "mongodb+srv://harshitrai2532005:e5BgYU9N2mr2PLeI@cluster0.rz5g32m.mongodb.net/MERN_STACK_LIBRARY_MANAGEMENT_SYSTEM?retryWrites=true&w=majority&appName=Cluster0"
  )
    .then(() => {
      console.log(" Database connected successfully");
    })
    .catch((err) => {
      console.error(" Error connecting to the database", err.message);
    });
};
