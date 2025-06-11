import AccessController from "../../controllers/access.controller";
import express from "express";
import { handleError } from "@/middlewares/handle.error";
const accessRouter = express.Router();

// sign up
accessRouter.post("/shop/signup", handleError(AccessController.signUp));

export default accessRouter;