import AccessController from "../../controllers/access.controller";
import express from "express";
import { handleError } from "@/middlewares/handle.error";
import { authencation } from "@/auth/authUtils";
const accessRouter = express.Router();

// sign up
accessRouter.post("/shop/signup", handleError(AccessController.signUp));
accessRouter.post("/shop/login", handleError(AccessController.login));


// auth
accessRouter.use(authencation);
accessRouter.post("/shop/logout", handleError(AccessController.logout));
export default accessRouter;