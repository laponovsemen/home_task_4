// @ts-ignore
import request from "supertest"
import {app} from "../../src/settings";
import {before} from "node:test";
export const auth = 'Authorization'
export const basic = 'Basic YWRtaW46cXdlcnR5'

//POSTS ROUTE
describe("TESTING OF CREATING POST", () => {
    it("should create post", async () => {
        await request(app).delete("/testing/all-data").set(auth, basic)
        const createdBlog = await request(app)
            .post("/blogs")
            .set(auth, basic)
            .send({"name":"new blog",
                "description":"description",
                "websiteUrl":"https://github.com/",
            })
            .expect(201)
        const blogId = createdBlog.body.id
        const result = await request(app)
            .post("/posts")
            .set(auth, basic)
            .send({"content":"new post content",
                "shortDescription":"description",
                "title":"post title",
                "blogId":`${blogId}`})
            .expect(201)
        expect(result.body).toEqual({"id": expect.any(String),
            "blogId": blogId,
            "blogName": "new blog",
            "content": "new post content",
            "createdAt": expect.any(String),
            "shortDescription": "description",
            "title": "post title"})

        const foundPost = await request(app)
            .get(`/posts/${result.body.id}`)
            .set(auth, basic)
            .expect(200)

        expect(foundPost.body).toEqual({
            "id": expect.any(String),
            "blogId": blogId,
            "blogName": "new blog",
            "content": "new post content",
            "createdAt": expect.any(String),
            "shortDescription": "description",
            "title": "post title"
        })
    })
})

describe("TESTING OF UPDATING POST BY ID", () => {
    it("should create post and by updating it must return 400 status code and array of errors", async () => {
        await request(app).delete("/testing/all-data").set(auth, basic)
        const createdBlog = await request(app)
            .post("/blogs")
            .set(auth, basic)
            .send({
                "name": "new blog",
                "description": "description",
                "websiteUrl": "https://github.com/",
            })
            .expect(201)
        const blogId = createdBlog.body.id
        const result = await request(app)
            .post("/posts")
            .set(auth, basic)
            .send({
                "content": "new post content",
                "shortDescription": "description",
                "title": "post title",
                "blogId": `${blogId}`
            })
            .expect(201)
        expect(result.body).toEqual({
            "id": expect.any(String),
            "blogId": blogId,
            "blogName": "new blog",
            "content": "new post content",
            "createdAt": expect.any(String),
            "shortDescription": "description",
            "title": "post title"
        })

        const updatedPost = await request(app)
            .put(`/posts/${result.body.id}`)
            .set(auth, basic)
            .send({
                    "title": "valid",
                    "content": "valid",
                    "blogId": "63189b06003380064c4193be",
                    "shortDescription": "length_101-DnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQx"
                }
            )
            .expect(400)
        expect(updatedPost.body).toEqual({
            errorsMessages:
                [
                    {message: "the length of shortDescription field is more than 100 chars", field: "shortDescription"},
                    {message: "No blogs with such id in database", field: "blogId"}
                ]
        })
    })
    it("should create post", async () => {
        await request(app).delete("/testing/all-data").set(auth, basic)
        const createdBlog = await request(app)
            .post("/blogs")
            .set(auth, basic)
            .send({
                "name": "new blog",
                "description": "description",
                "websiteUrl": "https://github.com/",
            })
            .expect(201)
        const blogId = createdBlog.body.id
        const result = await request(app)
            .post("/posts")
            .set(auth, basic)
            .send({
                "content": "content",
                "shortDescription": "description",
                "title": "post title",
                "blogId": `${blogId}`
            })
            .expect(201)
        expect(result.body).toEqual({
            "id": expect.any(String),
            "blogId": blogId,
            "blogName": "new blog",
            "content": "content",
            "createdAt": expect.any(String),
            "shortDescription": "description",
            "title": "post title"
        })

        const updatedPost = await request(app)
            .put(`/posts/${result.body.id}`)
            .set(auth, basic)
            .send({
                    "title": "title updated",
                    "content": "new post content",
                    "blogId": "63189b06003380064c4193be",
                    "shortDescription": "shortDescription after update"
                }
            )
            .expect(204)
        const foundPost = await request(app)
            .get(`/posts/${result.body.id}`)
            .set(auth, basic)
            .expect(200)
        expect(foundPost.body).toEqual({
            id: expect.any(String),
            blogName: "new blog",
            title: "title updated",
            content: "new post content",
            blogId: "63189b06003380064c4193be",
            shortDescription: "shortDescription after update",
            createdAt: expect.any(String)
        })
    })
})

describe("TESTING OF DELETING POST BY ID", () => {
    it("should create post", async () => {
        await request(app).delete("/testing/all-data").set(auth, basic)
        const createdBlog = await request(app)
            .post("/blogs")
            .set(auth, basic)
            .send({"name":"new blog",
                "description":"description",
                "websiteUrl":"https://github.com/",
            })
            .expect(201)
        const blogId = createdBlog.body.id
        const result = await request(app)
            .post("/posts")
            .set(auth, basic)
            .send({"content":"new post content",
                "shortDescription":"description",
                "title":"post title",
                "blogId":`${blogId}`})
            .expect(201)
        expect(result.body).toEqual({"id": expect.any(String),
            "blogId": blogId,
            "blogName": "new blog",
            "content": "new post content",
            "createdAt": expect.any(String),
            "shortDescription": "description",
            "title": "post title"})

        const updatedPost = await request(app)
            .delete(`/posts/${result.body.id}`)
            .set(auth, basic)
            .expect(204)

    })
})

describe("TESTING OF READING POST BY ID", () => {
    it("should create post", async () => {
        await request(app).delete("/testing/all-data").set(auth, basic)
        const createdBlog = await request(app)
            .post("/blogs")
            .set(auth, basic)
            .send({"name":"new blog",
                "description":"description",
                "websiteUrl":"https://github.com/",
            })
            .expect(201)
        const blogId = createdBlog.body.id
        const result = await request(app)
            .post("/posts")
            .set(auth, basic)
            .send({"content":"new post content",
                "shortDescription":"description",
                "title":"post title",
                "blogId":`${blogId}`})
            .expect(201)
        expect(result.body).toEqual({"id": expect.any(String),
            "blogId": blogId,
            "blogName": "new blog",
            "content": "new post content",
            "createdAt": expect.any(String),
            "shortDescription": "description",
            "title": "post title"})

        const foundPost = await request(app)
            .get(`/posts/${result.body.id}`)
            .set(auth, basic)
            .expect(200)
        expect(foundPost.body).toEqual({"id": expect.any(String),
            "blogId": blogId,
            "blogName": "new blog",
            "content": "new post content",
            "createdAt": expect.any(String),
            "shortDescription": "description",
            "title": "post title"})
    })
})