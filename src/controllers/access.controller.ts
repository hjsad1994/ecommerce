import { NextFunction, Request, Response } from "express";
import AccessService from "@/services/access.services";
import { CREATED, SuccessResponse } from "@/core/success.respone";
import { handleError } from "@/middlewares/handle.error";
import { AuthenticatedRequest } from "@/types";

class AccessController {
    handleRefreshToken = handleError(async (req: Request, res: Response, next: NextFunction) => {
        const result = await AccessService.handleRefreshToken(req.body.refreshToken);
        new SuccessResponse({
            message: 'Refresh token successfully',
            metadata: result
        }).send(res);
    })
    logout = handleError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const result = await AccessService.logout(req.keyStore);
        new SuccessResponse({
            message: 'Logout successfully',
            metadata: result
        }).send(res);
    })
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
