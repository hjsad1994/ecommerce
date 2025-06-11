import { NextFunction, Request, Response } from "express";
import ApiKeyServices from "@/services/apiKey.services";

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

const apiKey = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const key = req.headers[HEADER.API_KEY] as string;
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden Error'
            });
        }
        // check objKey
        const objKey = await ApiKeyServices.findById(key);
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden Error'
            });
        }
        (req as any).objKey = objKey; 
        return next();
    } catch (error) {
        next(error);
    }
}

const permission = (permission: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!(req as any).objKey?.permissions.includes(permission)) {
            return res.status(403).json({
                message: 'permission denied'
            });
        }
        const validPermission = (req as any).objKey?.permissions.includes(permission);
        if (!validPermission) {
            return res.status(403).json({
                message: 'permission denied'
            });
        }
        return next();
    }
}
export { apiKey, permission };
