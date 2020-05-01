import { Request, Response } from "express";
import { Controller, Get } from "../..";
import { code } from "../middlewares";

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
