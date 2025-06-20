import { NextFunction, Request, Response } from "express";
import AccessService from "@/services/access.services";
import { CREATED } from "@/core/success.respone";
import { handleError } from "@/middlewares/handle.error";

class AccessController {
    login = handleError(async (req: Request, res: Response, next: NextFunction) => {
        const result = await AccessService.login(req.body);
        new CREATED({
            message: 'Shop logged in successfully',
            metadata: result
        }).send(res);
    })
    signUp = handleError(async (req: Request, res: Response, next: NextFunction) => {
        const result = await AccessService.signUp(req.body);
        new CREATED({
            message: 'Shop registered successfully',
            metadata: result
        }).send(res);
    })
}

export default new AccessController();
