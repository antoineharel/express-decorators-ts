import "reflect-metadata";
import { Application, RequestHandler, Router, application } from "express";
import { RouteDefinition } from "./types";

application.registerController = function (this, controllers: any) {
    if (Array.isArray(controllers)) {
        controllers.forEach((controller) => registerOneController(this, controller));
    } else {
        registerOneController(this, controllers);
    }
};

export const Controller = (prefix: string = "", middlewares: RequestHandler[] = []): ClassDecorator => {
    return (target: any) => {
        Reflect.defineMetadata("prefix", prefix, target);
        Reflect.defineMetadata("middlewares", middlewares, target);

        // Since routes are set by our methods this should almost never be true (except the controller has no methods)
        if (!Reflect.hasMetadata("routes", target)) {
            Reflect.defineMetadata("routes", [], target);
        }
    };
};

let routeHandlerGenerator = (method: RouteDefinition["requestMethod"], path: string, middlewares: RequestHandler[]) => {
    return (target: Object, propertyKey: any): void => {
        if (!Reflect.hasMetadata("routes", target.constructor)) {
            Reflect.defineMetadata("routes", [], target.constructor);
        }

        const routes = Reflect.getMetadata("routes", target.constructor) as Array<RouteDefinition>;

        routes.push({
            requestMethod: method,
            path,
            methodName: propertyKey,
            middlewares,
        });
        Reflect.defineMetadata("routes", routes, target.constructor);
    };
};

export const Get = (path: string, middlewares: RequestHandler[] = []): MethodDecorator => routeHandlerGenerator("get", path, middlewares);
export const Post = (path: string, middlewares: RequestHandler[] = []): MethodDecorator => routeHandlerGenerator("post", path, middlewares);
export const Put = (path: string, middlewares: RequestHandler[] = []): MethodDecorator => routeHandlerGenerator("put", path, middlewares);
export const Delete = (path: string, middlewares: RequestHandler[] = []): MethodDecorator => routeHandlerGenerator("delete", path, middlewares);

const registerOneController = (app: Application, controller: any) => {
    const instance = new controller() as any;
    const prefix = Reflect.getMetadata("prefix", controller);
    const controllerMiddlewares: RequestHandler[] = Reflect.getMetadata("middlewares", controller);
    const routes: Array<RouteDefinition> = Reflect.getMetadata("routes", controller);

    let router = Router();

    routes.forEach((route) => {
        router[route.requestMethod](route.path, ...route.middlewares, instance[route.methodName]);
    });

    app.use(prefix, controllerMiddlewares, router);
};
