// src/types/express.d.ts

// Extend Express Request interface để add custom properties
declare global {
    namespace Express {
        interface Request {
            keyStore?: any;
            objKey?: any;
            refreshToken?: string;
            user?: any;
        }
        
        interface Error {
            status?: number;
        }
    }
}

// Hoặc augment Error interface trực tiếp
declare global {
    interface Error {
        status?: number;
    }
}

export {};