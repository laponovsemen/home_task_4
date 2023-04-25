// @ts-ignore
import request from "supertest";
import {app} from "../../src/settings";
import exp = require("constants");
const auth = 'Authorization'
const basic = 'Basic YWRtaW46cXdlcnR5'
describe("TESTING OF CREATING ALL BLOGS", () => {
    it("should create user //auth is correct", async () => {
        await request(app).delete("/testing/all-data").set(auth, basic)
        const result = await request(app)
            .post("/users")
            .set(auth, basic)
            .send({
                login : "login",
                password : "password",
                email : "simsbury65@gmail.com"
            })
            .expect(201)
        expect(result.body).toEqual({"createdAt": expect.any(String), "email": "simsbury65@gmail.com", "id": expect.any(String), "login": "login"})
    })
    it("should create 10 users and get then //auth is correct", async () => {
        await request(app).delete("/testing/all-data").set(auth, basic)

        //creating 10 users
        for(let i = 0; i < 10 ; i++) {
            await request(app)
                .post("/users")
                .set(auth, basic)
                .send({
                    login: `login${i}`,
                    password: "password",
                    email: "simsbury65@gmail.com"
                })
        }
        const result = await request(app)
            .get("/users")
            .expect(200)
        expect(result.body).toEqual({})

    }, 30000)

    it("should create user //auth is correct", async () => {
        await request(app).delete("/testing/all-data").set(auth, basic)
        const result = await request(app)
            .post("/users")
            .set(auth, basic)
            .send({
                login : "loginlogin",
                password : "passwordword",
                email : "simsbury65@gmail.com"
            })
            .expect(201)
        const userId = result.body.id
        const deletedUser = await request(app).delete(`/users/${userId}`).set(auth, basic).expect(204)
        const allUsers = await request(app).get("/users").expect(200)
        expect(allUsers.body.items).toEqual([])
    })

})