import { RequestHandler, application } from "express";

export interface RouteDefinition {
    path: string;
    requestMethod: "get" | "post" | "delete" | "options" | "put";
    methodName: string;
    middlewares: RequestHandler[];
}

declare module "express-serve-static-core" {
    interface Application {
        registerController(controllers: any[]): void;
        registerController(controllers: any): void;
    }
}
