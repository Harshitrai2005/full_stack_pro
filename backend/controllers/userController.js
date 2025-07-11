import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../model/userModel.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

// Get all verified users
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ accountVerified: true });

  res.status(200).json({
    success: true,
    users,
  });
});

// Register a new admin with avatar upload
export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Admin Avatar is required", 400));
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please fill all the details properly", 400));
  }

  const isRegistered = await User.findOne({ email, accountVerified: true });
  if (isRegistered) {
    return next(new ErrorHandler("The user has already been registered", 400));
  }

  if (password.length < 8 || password.length > 16) {
    return next(
      new ErrorHandler("The password must be between 8 and 16 characters long", 400)
    );
  }

  const { avatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(avatar.mimetype)) {
    return next(new ErrorHandler("File format not supported", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const cloudinaryResponse = await cloudinary.uploader.upload(
    avatar.tempFilePath,
    {
      folder: "LIBRARY_MANAGEMENT_SYSTEM_ADMIN_AVATARS",
    }
  );

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(
      new ErrorHandler("Failed to upload avatar image to Cloudinary", 500)
    );
  }

  const admin = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "Admin",
    accountVerified: true,
    avatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  res.status(201).json({
    success: true,
    message: "Admin registered successfully",
    admin,
  });
});

// Promote a user to Admin
export const makeUserAdmin = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email, accountVerified: true });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  user.role = "Admin";
  await user.save();

  res.status(200).json({
    success: true,
    message: `${user.name} has been promoted to Admin.`,
  });
});
