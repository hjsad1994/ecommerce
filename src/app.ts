import express, { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import { checkOverload } from "./helpers/check.connect";
import router from "./routes";
// import "./types/express"; // Import custom type declarations
const app = express();

// init middleware
app.use(morgan("dev")); // logging middleware
app.use(helmet()); // security middleware
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




// init db
require("./dbs/init.mongodb");
// checkOverload();

// init routes
app.use("/", router);

// handle error
app.use((req: Request, res: Response, next: NextFunction) => {
    const error: any = new Error('Not Found');
    error.status = 404;
    next(error);
});

// Error handling middleware với proper TypeScript typing
const errorHandler: ErrorRequestHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error.status || 500;
    const errorMessage = error.message || 'Internal Server Error';
    
    // Log error for debugging
    console.error('💥 Error occurred:', {
        statusCode,
        message: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        path: req.path,
        method: req.method
    });
    
    res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
};

app.use(errorHandler);

export default app; 