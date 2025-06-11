import type {
     NextFunction, 
     Request,
     Response,
     RequestHandler
} from "express";

export const handleError = (fn: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    }
}