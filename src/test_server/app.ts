import express, { Request, Response } from "express";
import { Controller, Get } from "../index";
import { code } from "./middlewares";

let app = express();

@Controller()
class HomeController {
    @Get("/")
    public async index(req: Request, res: Response) {
        res.send({
            result: "Hello World!",
        });
    }

    @Get("/query/:id")
    public async query(req: Request, res: Response) {
        res.send({
            result: req.params.id,
        });
    }

    @Get("/home/protected", [code(401)])
    public async protected(req: Request, res: Response) {
        res.send({
            result: req.params.id,
        });
    }
}

@Controller("/protected", [code(401)])
class ProtectedController {
    @Get("/")
    public async index(req: Request, res: Response) {
        res.send({
            result: "Hello World!",
        });
    }
    @Get("/existing")
    public async existing(req: Request, res: Response) {
        res.send({
            result: "Hello World!",
        });
    }
}

app.registerController([HomeController, ProtectedController]);

export default app;
