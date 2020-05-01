import "reflect-metadata";
import { Application, RequestHandler } from "express";
import { RouteDefinition, ControllerOptions, defaultControllerOptions } from "./types";

export const Controller = (prefix: string = "", options: ControllerOptions = defaultControllerOptions): ClassDecorator => {
    return (target: any) => {
        Reflect.defineMetadata("prefix", prefix, target);
        Reflect.defineMetadata("middlewares", options.middlewares, target);

        // Since routes are set by our methods this should almost never be true (except the controller has no methods)
        if (!Reflect.hasMetadata("routes", target)) {
            Reflect.defineMetadata("routes", [], target);
        }
    };
};

let handlerGenerator = (method: RouteDefinition["requestMethod"], path: string) => {
    return (target: Object, propertyKey: any): void => {
        if (!Reflect.hasMetadata("routes", target.constructor)) {
            Reflect.defineMetadata("routes", [], target.constructor);
        }

        const routes = Reflect.getMetadata("routes", target.constructor) as Array<RouteDefinition>;

        routes.push({
            requestMethod: method,
            path,
            methodName: propertyKey,
        });
        Reflect.defineMetadata("routes", routes, target.constructor);
    };
};

export const Get = (path: string): MethodDecorator => handlerGenerator("get", path);
export const Post = (path: string): MethodDecorator => handlerGenerator("post", path);
export const Put = (path: string): MethodDecorator => handlerGenerator("put", path);
export const Delete = (path: string): MethodDecorator => handlerGenerator("delete", path);

export const registerControllers = (app: Application, controllers: any[]) => {
    controllers.forEach((controller) => {
        const instance = new controller() as any;
        const prefix = Reflect.getMetadata("prefix", controller);
        const middlewares: RequestHandler[] = Reflect.getMetadata("middlewares", controller);
        const routes: Array<RouteDefinition> = Reflect.getMetadata("routes", controller);

        // Iterate over all routes and register them to our express application
        routes.forEach((route) => {
            app[route.requestMethod](prefix + route.path, ...middlewares, instance[route.methodName]);
        });
    });
};
