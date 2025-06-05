import express from "express";
import {register} from "../controllers/authController.js";
import {verifyOTP} from "../controllers/authController.js";
import {login} from "../controllers/authController.js";
import {logout} from "../controllers/authController.js";
import {isAuthenticated} from"../middlewares/authMiddleware.js"
import {getUser} from "../controllers/authController.js";
import {forgotPassword} from "../controllers/authController.js";
import {resetPassword} from "../controllers/authController.js";
import {updatePassword} from "../controllers/authController.js";

//http://localhost:4000/api/v1/auth
const router =express.Router();

router.post("/register",register)
router.post("/verify-otp",verifyOTP);
router.post("/login",login);
router.get("/logout",isAuthenticated,logout);
router.get("/me",isAuthenticated,getUser);
router.post("/password/forgot",forgotPassword);
router.put("/password/reset/:token",resetPassword);
router.put("/password/update",isAuthenticated,updatePassword);



export default router;