import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Controller, Get, Post, ValidateBody } from "../..";
import { code } from "../middlewares";

@Controller()
class HomeController {
    @Get("/")
    async index(req: Request, res: Response) {
        res.send({
            result: "Hello World!",
        });
    }

    @ValidateBody({
        id: { isString: true, optional: true },
    })
    @Post("/")
    async indexPost(req: Request, res: Response) {
        res.send({
            result: "Hello World!",
        });
    }

    @Get("/query/:id")
    async query(req: Request, res: Response) {
        res.send({
            result: req.params.id,
        });
    }

    @Get("/home/protected", [code(401)])
    async protected(req: Request, res: Response) {
        res.send({
            result: req.params.id,
        });
    }
}
