// @ts-ignore
import request from "supertest";
import {app} from "../../src/settings";
const auth = 'Authorization'
const basic = 'Basic YWRtaW46cXdlcnR5'
describe("TESTING OF CREATING ALL BLOGS", () => {
    it("should return create user //auth is correct", async () => {
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
        expect(result.body).toEqual({"createdAt": "2023-04-25T10:59:48.790Z", "email": "simsbury65@gmail.com", "id": "6447b2a43cd6a54629838532", "login": "login"})
    })



})