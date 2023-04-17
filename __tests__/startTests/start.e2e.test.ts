// @ts-ignore
import request from "supertest"
import {app} from "../../src/settings";
import {before} from "node:test";

describe("START ROUTE", () => {
    it("should return status code 200 and message \"API started working\"", () => {
        request(app)
            .get("")
            .expect(200)
    })
})

