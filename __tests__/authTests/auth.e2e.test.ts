// @ts-ignore
import request from "supertest";
import {app} from "../../src/settings";
import exp = require("constants");
const auth = 'Authorization'
const basic = 'Basic YWRtaW46cXdlcnR5'
describe("TESTING OF CREATING USER AND AUTH", () => {
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
        expect(result).toEqual("")

    }, 10000)



})