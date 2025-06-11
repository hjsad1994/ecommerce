import express from "express";
import accessRouter from "./accessRouter";
import { apiKey, permission } from "@/auth/checkAuth";

const router = express.Router();


router.use(apiKey as any);
router.use(permission('0000') as any);

router.use("/v1/api", accessRouter);

export default router;