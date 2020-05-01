import express from "express";
import path from "path";
import { Decorated } from "../index";

let app = express();
Decorated.setApp(app, path.join(__dirname, "Controllers"));

export default app;
