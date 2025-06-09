
import mongoose from 'mongoose';
import { countConnect } from "../helpers/check.connect";
import envConfig, { validateEnv } from "../configs/env.config";

// Validate environment variables before connecting
validateEnv();

// Get MongoDB connection string from environment config
const connectString = envConfig.MONGODB_URI;

class Database {
    private static instance: Database;
    
    constructor() {
        this.connect();
    }
    
    // connect
    connect(type = 'mongodb'): void {
        // Enable debug mode in development
        if (process.env.NODE_ENV === 'development') {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
        }
        
        mongoose.connect(connectString, {
            maxPoolSize: 50, // Maximum number of connections
            wtimeoutMS: 2500, // Give up after 2.5 seconds
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as any).then(() => {
            console.log('✅ Connected to MongoDB Atlas successfully!');
            console.log(`📊 Active connections: ${countConnect()}`);
        }).catch((err: Error) => {
            console.error('❌ Error connecting to MongoDB:', err.message);
            process.exit(1);
        });
    }
    
    static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}
const instanceMongodb = Database.getInstance();

export default instanceMongodb;


