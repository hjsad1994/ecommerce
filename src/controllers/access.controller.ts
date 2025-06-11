import { NextFunction, Request, Response } from "express";
import { ShopSignUpRequest } from "@/types";
import AccessService from "@/services/access.services";
import { CREATED } from "@/core/success.respone";

class AccessController {
    signUp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await AccessService.signUp(req.body);
            new CREATED({
                message: 'Shop registered successfully',
                metadata: result
            }).send(res);
        } catch (error) {
            next(error);
        }
    }
}

export default new AccessController();
