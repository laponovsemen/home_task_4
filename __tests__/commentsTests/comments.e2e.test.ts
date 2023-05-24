// @ts-ignore
import request from "supertest";
import exp = require("constants");
import {randomUUID} from "crypto";
import mongoose from "mongoose";
import {app} from "../../src";


const auth = 'Authorization'
const basic = 'Basic YWRtaW46cXdlcnR5'

const mongoURI = process.env.MONGO_URL!

describe("CREATEING COMMENTS FOR SPECIFIED POST TESTFLOW", () => {
    beforeAll(async () => {
        /* Connecting to the database. */
        await mongoose.connect(mongoURI)
    })

    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close()
    })
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
            }).expect(201)

        expect(createdUser.body).toEqual({
            id : expect.any(String),
            login : "login",
            email : "simsbury65@gmail.com",
            createdAt: expect.any(String),
        })

        const login = await request(app)
            .post("/auth/login")
            .set(auth, basic)
            .send({
                loginOrEmail: "login",
                password: "password",
            }).expect(200)

        const JWT = login.body.accessToken
        const JWTAuth = "Bearer ".concat(JWT)
        console.log(JWTAuth)

        expect(JWT).toEqual(expect.any(String))

        //console.log(JWT)
        const createdComment = await request(app)
            .post(`/posts/${postId}/comments`)
            .set(auth, JWTAuth)
            .send({
                content: "stringstringstringst"
            }).expect(201)
        expect(createdComment.body).toEqual(
            {commentatorInfo:
                    {
                        userId: expect.any(String),
                        userLogin: expect.any(String)
                    },
            content: "stringstringstringst",
            createdAt: expect.any(String),
            id: expect.any(String)})
        const commentId = createdComment.body.id

        const wrongId = "6452328cf49782a0f0000000"
        //console.log(wrongId)
        //console.log(postId)
        await request(app)
            .post(`/posts/${wrongId}/comments`)
            .set(auth, JWTAuth)
            .send({
                content: "stringstringstringst"
            }).expect(404)

        await request(app)
            .delete(`/comments/${wrongId}`)
            .set(auth, JWTAuth)
            .expect(404)

        await request(app)
            .put(`/comments/${wrongId}`)
            .set(auth, JWTAuth)
            .send({content : "length25 - kkkkkkkkkkkkkkk"})
            .expect(404)

        const tryOfUpdatingComment = await request(app)
            .put(`/comments/${commentId}`)
            .set(auth, JWTAuth)
            .send({content : "length25 - kkkkkkkkkkkkkkk"})
            .expect(204)

        await request(app)
            .delete(`/comments/${commentId}`)
            .set(auth, JWTAuth)
            .expect(204)

        console.log(commentId)
        console.log(JWTAuth)
        await request(app)
            .get(`/comments/${commentId}`)
            .set(auth, JWTAuth)
            .expect(404)


        //expect(tryOfUpdatingComment.body).toEqual("")
    }, 60000)

    /*it("should create delete and update comments //auth is correct", async () => {



    })*/
})