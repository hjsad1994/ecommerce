// src/types/express.ts
declare global {
    namespace Express {
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