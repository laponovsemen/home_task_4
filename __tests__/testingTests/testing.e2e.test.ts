import request from "supertest"
import {before} from "node:test";
import {auth, basic} from "../postsTests/posts.e2e.test";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {app} from "../../settings";
dotenv.config()

const mongoURI = process.env.MONGO_URL!
//TESTING ROUTE
describe("testing od deleting all data  ", () => {
    beforeAll(async () => {
        /* Connecting to the database. */
        await mongoose.connect(mongoURI)
    })

    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close()
    })
    it("testing od deleting all data // correct authorization ",async () => {
        request(app)
            .delete("/testing/all-data")
            .set(auth, basic)
            .expect(204)
    })

    it("testing od deleting all data // incorrect authorization // wrong Authorization field value", () => {
        request(app)
            .delete("/testing/all-data")
            .set(auth, "ksdjfl;skdfjlkds")
            .expect(401)
    })

    it("testing od deleting all data // incorrect authorization // no Authorization field in header", () => {
        request(app)
            .delete("/testing/all-data")
            .set("lkdhjflksdfhkldsjhf", basic)
            .expect(401)
    })
    it("testing of getting all security devices", async () => {
        const gettingAllDevices = await request(app)
            .get("/testing/all-data/all-security-devices")
            .expect(200)
        console.log(gettingAllDevices.body)
    })
})

