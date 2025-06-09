import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface EnvConfig {
    // Server
    PORT: number;
    NODE_ENV: 'development' | 'production' | 'test';
    
    // Database
    MONGODB_URI: string;
    DB_NAME: string;
    
    // Authentication (for future use)
    JWT_SECRET?: string;
    JWT_EXPIRES_IN?: string;
    BCRYPT_SALT_ROUNDS?: number;
}

const envConfig: EnvConfig = {
    // Server Configuration
    PORT: parseInt(process.env.PORT || '3052', 10),
    NODE_ENV: (process.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
    
    // Database Configuration
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_dev',
    DB_NAME: process.env.DB_NAME || 'ecommerce_backend',
    
    // Authentication Configuration
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
};

// Validate required environment variables
const validateEnv = (): void => {
    const requiredEnvVars = ['MONGODB_URI'];
    
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            console.error(`❌ Missing required environment variable: ${envVar}`);
            process.exit(1);
        }
    }
    
    console.log('✅ Environment variables validated successfully');
};

export { envConfig, validateEnv };
export default envConfig; 