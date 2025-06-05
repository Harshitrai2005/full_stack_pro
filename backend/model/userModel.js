import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";



export const userschema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        required:true,
        type:String,
        lowercase:true
    },
    password:{
        required:true,
        type:String,
        select:false,
    },
    role:{
        type:String,
        enum:["User","Admin"],
        default:"User"
    },
    accountVerified:{type:Boolean, default:false},
    borrowedBooks:[
        {
            bookId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Borrow"
            },
            returned:{
                type:Boolean,
                default:false,
            },
            bookTitle:String,
            borrowedDate:Date,
            dueDate:Date,
        }
    ],

    avatar:{
        public_id:String,
        url:String,
    },
    verificationCode:Number,
    verificationCodeExpire:Date,
    resetPasswordToken:String,
    resetPasswordExpire:Date,


},


{
    timestamps:true,
}
)



userschema.methods.generateVerificationCode=function(){
    function generateRandomFiveDigitNumber(){
        const firstDigit=Math.floor(Math.random()*9)+1;
        const remainingDigits=Math.floor(Math.random()*10000).toString().padStart(4,0);

        return parseInt(firstDigit+remainingDigits);


    }

    const verificationCode=generateRandomFiveDigitNumber();
    this.verificationCode=verificationCode;
    this.verificationCodeExpire=new Date(Date.now()+15*60*1000);
    return verificationCode;
}

userschema.methods.generateToken=function(){
     return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY)
}

userschema.methods.getResetPasswordToken=function(){
    const resetToken=crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken=crypto.createHash("sha256").
    update(resetToken)
    .digest("hex");

    this.resetPasswordExpire=new Date(Date.now() + 15*60*1000);

    return resetToken;



}

export const User=mongoose.model("User",userschema);

