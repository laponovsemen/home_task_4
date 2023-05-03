// @ts-ignore
import request from "supertest";
import {app} from "../../src/settings";
import exp = require("constants");
const auth = 'Authorization'
const basic = 'Basic YWRtaW46cXdlcnR5'
describe("CREATEING COMMENTS FOR SPECIFIED POST TESTFLOW", () => {
    it("should create user, blog, pot, comment , auth and get comments //auth is correct", async () => {
        request(app).delete("/testing/all-data").set(auth, basic)
        const createdBlog = await request(app)
            .post("/blogs")
            .set(auth, basic)
            .send({
                name : "string", //maxLength: 15
                description : "string",// maxLength: 500
                websiteUrl : "https://samurai.it-incubator.io/pc" // maxLength: 100 pattern: ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
            })
            .expect(201)
        expect(createdBlog.body).toEqual({
            id : expect.any(String),
            name : "string", //maxLength: 15
            description : "string",// maxLength: 500
            websiteUrl : "https://samurai.it-incubator.io/pc",// maxLength: 100 pattern
            createdAt : expect.any(String),
            isMembership : false
        })

        const blogId = createdBlog.body.id

        const createdPost = await request(app).post(`/posts`)
            .set(auth, basic)
            .send({
                title: `string`, //    maxLength: 30
                shortDescription: "string", //maxLength: 100
                content: "string", // maxLength: 1000
                blogId: blogId
            })
            .expect(201)
        const postId = createdPost.body.id

        const createdUser = await request(app)
            .post("/users")
            .set(auth, basic)
            .send({
                login: "login",
                password: "password",
                email: "simsbury65@gmail.com"
            })

        const login = await request(app)
            .post("/auth/login")
            .set(auth, basic)
            .send({
                loginOrEmail: "login",
                password: "password",
            })

        const JWT = login.body.accessToken
        const JWTAuth = "Bearer ".concat(JWT)
        console.log(JWTAuth)

        expect(JWT).toEqual(expect.any(String))

        console.log(JWT)
        const createdComment = await request(app)
            .post(`/posts/${postId}/comments`)
            .set(auth, JWTAuth)
            .send({
                content: "stringstringstringst"
            }).expect(201)
        expect(createdComment.body).toEqual("")

        await request(app)
            .post(`/posts/${postId}kwepoirpweo/comments`)
            .set(auth, JWTAuth)
            .send({
                content: "stringstringstringst"
            }).expect(401)
        expect(createdComment.body).toEqual("")

    })
})