import AccessController from "../../controllers/access.controller";
import express, { Request, Response } from "express";

const accessRouter = express.Router();

// sign up
accessRouter.post("/shop/signup", AccessController.signUp);

export default accessRouter;