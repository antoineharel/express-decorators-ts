import express, { Request, Response, NextFunction } from "express";

export const code = (code: number) => (req: Request, res: Response, next: NextFunction) => {
    return res.sendStatus(code);
};
