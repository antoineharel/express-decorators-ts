import "colors";
import { Application, RequestHandler, Router } from "express";
import recursive from "recursive-readdir";
import "reflect-metadata";

export interface RouteDefinition {
    path: string;
    requestMethod: "get" | "post" | "delete" | "options" | "put";
    methodName: string;
    middlewares: RequestHandler[];
}

export class Decorated {
    static app: Application;
    public static setApp = (app: Application, pathToControllers: string) => {
        Decorated.app = app;

        recursive(pathToControllers, ["!*.controller.*"], (err, files) => {
            if (err) {
                console.error();
                console.error(`[ERROR] Specified controllers path does not exist`.red);
                console.error(pathToControllers.white);
                console.error();

                return;
            }
            files.forEach((file) => {
                try {
                    import(file);
                } catch (error) {
                    console.error();
                    console.error(`[ERROR] Could not load controller :`.red);
                    console.error(file.white);
                    console.error();
                }
            });
        });
    };
}

export const Controller = (prefix: string = "", middlewares: RequestHandler[] = []): ClassDecorator => {
    return (target: any) => {
        Reflect.defineMetadata("prefix", prefix, target);
        Reflect.defineMetadata("middlewares", middlewares, target);

        if (!Reflect.hasMetadata("routes", target)) {
            Reflect.defineMetadata("routes", [], target);
        }

        registerOneController(Decorated.app, target);
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
        let method = route.requestMethod;
        let path = route.path;
        let middlewares = route.middlewares;
        let handler = instance[route.methodName];

        router[method](path, ...middlewares, handler);
    });

    app.use(prefix, controllerMiddlewares, router);
};
