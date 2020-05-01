import { RequestHandler } from "express";

export interface RouteDefinition {
    path: string;
    requestMethod: "get" | "post" | "delete" | "options" | "put";
    methodName: string;
}

export interface ControllerOptions {
    middlewares: RequestHandler[];
}

export const defaultControllerOptions: ControllerOptions = {
    middlewares: [],
};
