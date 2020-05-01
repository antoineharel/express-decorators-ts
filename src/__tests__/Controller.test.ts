import request from "supertest";

import app from "../test_server/app";

describe("Home Controller", () => {
    test("Public", () => request(app).get("/").expect(200).expect({ result: "Hello World!" }));
    test("Public query", () => request(app).get("/query/12").expect(200).expect({ result: "12" }));
    test("Public 404", () => request(app).get("/not_existing").expect(404));
    test("Public protected route", () => request(app).get("/home/protected").expect(401));
});

describe("Protected Controller", () => {
    test("Protected route", () => request(app).get("/protected").expect(401));
    test("Protected existing route", () => request(app).get("/protected/existing").expect(401));
    test("Protected 404 route", () => request(app).get("/protected/edze").expect(401));
});
