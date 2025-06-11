import AccessController from "../../controllers/access.controller";
import express from "express";
import { asyncHandler } from "@/auth/checkAuth";
const accessRouter = express.Router();

// sign up
accessRouter.post("/shop/signup", asyncHandler(AccessController.signUp));

export default accessRouter;