import { NextFunction, Request, Response } from "express";
import ApiKeyServices from "@/services/apiKey.services";

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

const apiKey = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('🔐 API Key middleware checking...');
        const key = req.headers[HEADER.API_KEY] as string;
        console.log('🔑 Received API key:', key ? `${key.substring(0, 20)}...` : 'NONE');
        
        if (!key) {
            console.log('❌ No API key provided');
            return res.status(403).json({
                message: 'Forbidden Error - No API key'
            });
        }
        
        // check objKey
        console.log('🔍 Looking up API key in database...');
        const objKey = await ApiKeyServices.findById(key);
        console.log('📋 API key found:', objKey ? 'YES' : 'NO');
        
        if (objKey) {
            console.log('✅ API key details:', {
                status: objKey.status,
                permissions: objKey.permissions
            });
        }
        
        if (!objKey) {
            console.log('❌ API key not found in database');
            return res.status(403).json({
                message: 'Forbidden Error - Invalid API key'
            });
        }
        
        (req as any).objKey = objKey; 
        console.log('✅ API key validated, proceeding to permission check');
        return next();
    } catch (error) {
        console.error('❌ API key middleware error:', error);
        next(error);
    }
}

const permission = (permission: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        console.log('🔒 Permission middleware checking...');
        console.log('🎯 Required permission:', permission);
        console.log('👤 User permissions:', (req as any).objKey?.permissions);
        
        const hasPermission = (req as any).objKey?.permissions.includes(permission);
        console.log('✅ Permission check result:', hasPermission);
        
        if (!hasPermission) {
            console.log('❌ Permission denied');
            return res.status(403).json({
                message: 'permission denied'
            });
        }
        
        console.log('✅ Permission granted, proceeding to route handler');
        return next();
    }
}
export { apiKey, permission };
