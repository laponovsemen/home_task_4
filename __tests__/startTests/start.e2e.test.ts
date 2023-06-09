// @ts-ignore
import request from "supertest"
import {before} from "node:test";
import mongoose from "mongoose";
import {appSettings} from "../../src/app-settings";
import {app} from "../../src";

const mongoURI = appSettings.MONGO_URL
describe("START ROUTE", () => {
    beforeAll(async () => {
        /* Connecting to the database. */
        await mongoose.connect(mongoURI)
    })

    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close()
    })
    it("should return status code 200 and message \"API started working\"", () => {
        request(app)
            .get("")
            .expect(200)
    })
})

