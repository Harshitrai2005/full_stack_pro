import express from "express";
import {getAllUsers,registerNewAdmin,makeUserAdmin} from "../controllers/userController.js";
import {isAuthenticated,isAuthorized} from "../middlewares/authMiddleware.js";

const router=express.Router();

router.get("/all",isAuthenticated,isAuthorized("Admin"),getAllUsers);
router.post("/add/new-admin",isAuthenticated,isAuthorized("Admin"),registerNewAdmin);
router.post("/make-admin", isAuthenticated, makeUserAdmin);

export default router;
