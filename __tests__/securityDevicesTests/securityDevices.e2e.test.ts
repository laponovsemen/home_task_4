// @ts-ignore
import request from "supertest";
import {app} from "../../src/settings";
import exp = require("constants");
import {ObjectId} from "mongodb";

const auth = 'Authorization'
const basic = 'Basic YWRtaW46cXdlcnR5'

describe("TEST OF CHECKING CONNECTED DEVICES", () => {
    jest.setTimeout(30000)
    it("creating user, login 4 times and check devices", async () => {
        await request(app).delete("/testing/all-data")
        const registration = await request(app)
            .post("/auth/registration")
            .send({
                login: "login",
                email : "igorlaponov01011972@gmail.com",
                password : "password"
            }).expect(201)
        expect(registration.body.code).toEqual(expect.any(String))
        const registrationCode = registration.body.code


        const registrationConfirmation = await request(app)
            .post("/auth/registration-confirmation")
            .send({
                code : registrationCode
            }).expect(204)


        const login = await request(app)
            .post("/auth/login")
            .send({
                loginOrEmail : "login",
                password : "password"
            }).expect(200)
        console.log(login.body.accessToken)
    })


})