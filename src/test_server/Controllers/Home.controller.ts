import { Request, Response } from "express";
import { Controller, Get } from "../..";
import { code } from "../middlewares";

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
