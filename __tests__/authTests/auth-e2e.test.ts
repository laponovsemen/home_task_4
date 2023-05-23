// @ts-ignore
import request from "supertest";
import {app} from "../../src/settings";
import exp = require("constants");
import mongoose from "mongoose";
const auth = 'Authorization'
const basic = 'Basic YWRtaW46cXdlcnR5'
const mongoURI = "mongodb+srv://simsbury65:incubator@cluster0.vai5lbz.mongodb.net/?retryWrites=true&w=majority"
describe("TESTING OF CREATING USER AND AUTH", () => {
    beforeAll(async () => {
        /* Connecting to the database. */
        await mongoose.connect(mongoURI)
    })

    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close()
    })
    it("should authorize user //auth is correct", async () => {
        await request(app).delete("/testing/all-data").set(auth, basic)
        const user = await request(app)
            .post("/users")
            .set(auth, basic)
            .send({
                login: "login",
                password: "password",
                email: "simsbury65@gmail.com"
            })
            .expect(201)
        expect(user.body).toEqual({
            "createdAt": expect.any(String),
            "email": "simsbury65@gmail.com",
            "id": expect.any(String),
            "login": "login"
        })

        const token = await request(app)
            .post("/auth/login")
            .send({
                loginOrEmail: "simsbury65@gmail.com",
                password: "password"
            })
            .expect(200)

        expect(token.body.accessToken).toEqual(expect.any(String))

    })
    it("sdfdsfsdfds", async () => {
        const result = await request(app).post("/auth/registration").send({
            email : "igorlaponov01011972@gmail.com",
            login : "string",
            password : "string",
        }).expect(204)


    }, 10000)
    it("sdfdsfsdfds2", async () => {
        const result = await request(app)
            .post("/auth/registration-confirmation")
            .send({"code":"ee751dc0-bd44-41e2-a303-1c8bfade13bd"})
            .expect(400)


    }, 10000)



})