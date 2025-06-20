// src/types/express.d.ts

// Extend Express Request interface để add custom properties
declare global {
    namespace Express {
        interface Request {
            keyStore?: any; // KeyToken storage from authentication middleware
            objKey?: any;   // API key object from checkAuth middleware
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