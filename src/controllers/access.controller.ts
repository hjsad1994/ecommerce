import { NextFunction, Request, Response } from "express";
import { ShopSignUpRequest, ApiResponse } from "@/types";
import AccessService from "@/services/access.services";

class AccessController {
    signUp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, password }: ShopSignUpRequest = req.body;

            // Validate input
            if (!name || !email || !password) {
                res.status(400).json({
                    success: false,
                    message: "Missing required fields",
                    error: "Name, email và password là bắt buộc"
                } as ApiResponse);
                return;
            }

            console.log(`[P]::signUp::`, { email, name });

            const result = await AccessService.signUp({ name, email, password });

            if (result.error) {
                res.status(result.code || 400).json({
                    success: false,
                    message: result.error.message || "Đăng ký thất bại",
                    error: result.error.code
                } as ApiResponse);
                return;
            }

            res.status(result.code || 201).json({
                success: true,
                message: "Đăng ký shop thành công",
                data: result.metadata
            } as ApiResponse);

        } catch (error) {
            next(error);
        }
    }
}
export default new AccessController();
