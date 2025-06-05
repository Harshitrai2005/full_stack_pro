import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import {User} from "../model/userModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import {sendVerificationCode} from "../utils/sendVerificationCode.js";
import {sendToken} from "../utils/sendToken.js"
import {generateForgotPasswordEmailTemplate} from "../utils/emailTemplate.js";
import {sendEmail} from "../utils/sendEmail.js";

export const register=catchAsyncErrors(async (req,res,next)=>{
    try{
        const {name , email,password}=req.body;
        if(!name|| !email || !password){
            return next(new ErrorHandler("Please enter alll field details ", 400));
        }
        const isRegistered=await User.findOne({email,accountVerified:true});
        if(isRegistered){
            return next(new ErrorHandler("User already registered",400));
        }

        const registrationAttemptsByUser=await User.findOne({email,accountVerified:false});
        
        if (registrationAttemptsByUser && registrationAttemptsByUser.length >= 5)
        {
            return next(new ErrorHandler("You have exceeded registration attempts.Please Try registration after some time",400))
        }

         if(password.length<8 || password.length>16){
            return next (new ErrorHandler("Password must be between 8 and 16 characters",400));
         }

         const hashedPassword=await bcrypt.hash(password,10);
         const user = await User.create({
            name,
            email,
            password:hashedPassword,
         })
         const verificationCode=await user.generateVerificationCode();
         await user.save();
         await sendVerificationCode(verificationCode,email);

      res.status(200).json({
      success: true,
      message: "Verification code sent to email",
    });

    }catch(error){
        next(error);
    }
});

export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    const userAllEntries = await User.find({
      email,
      accountVerified: false,
    }).sort({ createdAt: -1 });

    if (!userAllEntries || userAllEntries.length === 0) {
      return next(new ErrorHandler("User Not Found", 400));
    }

    let user = userAllEntries[0];

    if (userAllEntries.length > 1) {
      await User.deleteMany({
        _id: { $ne: user._id },
        email,
        accountVerified: false,
      });
    }

    if (user.verificationCode !== Number(otp)) {
      return next(new ErrorHandler("Invalid OTP", 400));
    }

    const currentTime = Date.now();
    const verificationCodeExpire = new Date(user.verificationCodeExpire).getTime();

    if (currentTime > verificationCodeExpire) {
      return next(new ErrorHandler("OTP Expired", 400));
    }

    user.accountVerified = true;
    user.verificationCodeExpire = null;
    user.verificationCode = null;

    await user.save({ validateModifiedOnly: true });

    sendToken(user, 200, "Account Verified", res);
  } catch (error) {
    console.log(error);
    
  }
});


export const login =catchAsyncErrors(async (req,res,next)=>{
  const {email,password}=req.body;
  if(!email || !password){
    return next(new ErrorHandler("Please enter all the fields properly",400));
  }

  const user=await User.findOne({email,accountVerified:true}).select("+password");
  if(!user){
    return next(new ErrorHandler("invalid email or password",400));
  }

  const isPasswordMatched=await bcrypt.compare(password,user.password);

  if(!isPasswordMatched){
    return next(new ErrorHandler("Password did not match",400));
  }

  sendToken(user,200,"User logged in Successfully",res);


})


export const logout=catchAsyncErrors(async (req,res,next)=>{
       
  res.status(200).cookie("token"," ",{
    expires:new Date(Date.now()),
    httpOnly:true,
  }).json({
    success:true,
    message:"User logged out succesfully",
  })

})

export const getUser =catchAsyncErrors(async(req,res,next)=>{
  const user=req.user;
  res.status(200).json({
    success:true,
    user,
});
})


export const forgotPassword=catchAsyncErrors(async (req,res,next)=>{
  if(!req.body.email){
    return next(new ErrorHandler("email is required",400));
  }
  const user=await User.findOne({
    email:req.body.email,
    accountVerified:true,
  })

  if(!user){
    return next(new ErrorHandler("User not found",400));
  }

  const resetToken=user.getResetPasswordToken();

  await user.save({validateBeforeSave:false});


  const resetPasswordUrl=`${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  
  const message=generateForgotPasswordEmailTemplate(resetPasswordUrl);

  try{
    await sendEmail({email:user.email,
    subject:"Bookworm Library Management Recovery",
    message,
  })
  res.status(200).json({
    success:true,
    message:`Email sent to ${user.email} successfully`
  })
  }catch(error){
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save({validateBeforeSave:false});
    return next(new ErrorHandler(error.message,500));
  }
  


})

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Reset Password token is invalid or has expired", 400)
    );
  }

  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return next(new ErrorHandler("Please provide both password fields", 400));
  }

  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Password and Confirm Password do not match", 400)
    );
  }

  if (
    password.length < 8 ||
    password.length > 16 ||
    confirmPassword.length < 8 ||
    confirmPassword.length > 16
  ) {
    return next(
      new ErrorHandler("Password must be between 8 and 16 characters", 400)
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, "Password reset successfully", res);
});

export const updatePassword=catchAsyncErrors(async (req,res,next)=>{
       const user=await User.findById(req.user._id).select("+password");
       const {currentPassword,newPassword,confirmNewPassword}=req.body;
       if(!currentPassword || !newPassword || !confirmNewPassword){
        return next(new ErrorHandler("Please enter all the fields properly",400));
       }
       
       
       const isPasswordmatched=await bcrypt.compare(currentPassword,user.password);
       if(!isPasswordmatched){
        return next(new ErrorHandler("Current password does not match with the registered password",400));
       }

       if(newPassword.length<8|| newPassword.length>16||
        confirmNewPassword.length<8 || confirmNewPassword.length>16
       ){
        return next(new ErrorHandler("Password must be between 8 to 16 characters in length",400));
       }

       if(newPassword!==confirmNewPassword){
        return next(
          new ErrorHandler("new and cofirm new passwords do not match",400)
        );
       }

       const hashedPassword=await bcrypt.hash(newPassword,10);
       user.password=hashedPassword;
       await user.save();

    res.status(200).cookie("token"," ",{
    expires:new Date(Date.now()),
    httpOnly:true,
     }).json({
        success:true,
        message:"Password Updated Successfully",
       })
})




