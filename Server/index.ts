import cookieParser from 'cookie-parser';
import cors from "cors";
import express from "express";
import helmet from "helmet";
import path from "path"
import http from "node:http";
import multer, { Multer } from 'multer';
import { errorHandler, notFoundHandler } from "./api/middlewares/errorHandler";
import { webRouters } from "./api/web";
import dotenv from './utils/dotenv';
import logger from './utils/logger';
import connectDatabase from "./utils/mongodb";

const PREFIX_API = "/api";

dotenv.config();

class App {
    public app: express.Application;
    public server: any;
    public port: string | number;
    public upload: Multer;

    private config() {
        const NODE_ENV = process.env.NODE_ENV || 'development';
        this.app.use(helmet());
        this.app.use(cookieParser());
        this.app.use(cors({
            origin: NODE_ENV === 'production' ? (process.env.ALLOWED_ORIGIN ? process.env.ALLOWED_ORIGIN.split(',') : true) : true,
            credentials: true,
            allowedHeaders: 'X-PINGOTHER, Content-Type, Authorization, X-Forwarded-For, x-requested-with, Cache-Control',
            methods: 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS',
            optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
        }));
        this.app.use(express.json({ limit: "50mb" }));
        this.app.enable('trust proxy');
        this.app.use(PREFIX_API, (_req, res, next) => {
            res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
            res.setHeader("Pragma", "no-cache");
            res.setHeader("Expires", "0");
            next();
        });
        // this.app.use((req, res, next) => {
        //     if (req.secure) {
        //         next();
        //     } else {
        //         res.redirect(301, `http://${req.headers.host}${req.url}`);
        //     }
        // });
        this.app.get("/", (_req, res) => {
            res.status(200).send("WebHSV API is running");
        });
        this.app.get("/health", (_req, res) => {
            res.status(200).json({ status: "ok" });
        });
        this.app.use(PREFIX_API, webRouters);
        this.app.use(express.urlencoded({ extended: true, limit: "50mb" }));
    }

    constructor() {
        this.app = express();
        this.server = (http.createServer as any)(this.app);
        this.port = process.env.PORT || 3001;
        this.upload = multer();
        this.config();
        this.useAPI();
    }

    run() {
        this.server.listen(this.port, () => {
            logger.info(`Server is running on port ${this.port}`);
        });
        connectDatabase();
    }

    private useAPI() {
        // Web
        this.app.use(PREFIX_API, webRouters);
        this.app.use('/images', express.static('images'));
        this.app.use(errorHandler);
        this.app.use(notFoundHandler);
    }
}
export { App };
