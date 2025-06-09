import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import { checkOverload } from "./helpers/check.connect";
import router from "./routes";

const app = express();

// init middleware
app.use(morgan("dev")); // logging middleware
app.use(helmet()); // security middleware
app.use(compression());




// init db
require("./dbs/init.mongodb");
// checkOverload();

// init routes
app.use("/", router);


export default app; 