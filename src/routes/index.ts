import express, { Request, Response } from "express";
import accessRouter from "./accessRouter";

const router = express.Router();

// init routes
// router.get("", (req: Request, res: Response) => {
//     res.status(200).json({
//         message: "Hello World",
//     });
// });

router.use("/v1/api", accessRouter);
export default router;