import express from "express";
import path from "path";
import { Decorated } from "../index";
import bodyParser from "body-parser";

let app = express();
app.use(bodyParser.json());

Decorated.setApp(app, path.join(__dirname, "Controllers"));

export default app;
