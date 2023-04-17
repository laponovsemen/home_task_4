import {PostInsertModelType, PostViewModelType} from "../appTypes";
import {NextFunction, Request, Response} from "express";

import {client} from "../db";
import {mongoBlogSlicing, mongoPostSlicing} from "../common";
import {blogsCollection} from "../blogs/blogsRepositoryMongoDB";
import {ObjectId} from "mongodb";
import {validationResult} from "express-validator";

export async function getPostById(req: Request, res: Response) {
    const blogId = req.params.id
    if(blogId) {
        const result = await client.db("forum").collection<PostViewModelType>("posts").findOne({_id: new ObjectId(blogId)})
        if(result) {
            res.status(200).send(mongoPostSlicing(result))
        } else {
            res.sendStatus(404)
        }
    } else {
        res.sendStatus(404)
    }
}
export async function getAllPosts(req: Request, res: Response) {
     const result = await client.db("forum").collection<PostViewModelType>("posts").find({}).toArray()
     res.status(200).send(result.map(post => mongoPostSlicing(post)))

}

export async function deletePostById(req: Request, res: Response) {
    const deletedPost = await client.db("forum").collection("posts").deleteOne({_id: new ObjectId(req.params.id)})
    if(deletedPost.deletedCount === 0){
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }

}

export async function createPost(req: Request, res: Response) {
    const blog = await client.db("forum").collection("blogs").findOne({_id : new ObjectId(req.body.blogId)})
    if(blog) {
        const newPost: PostInsertModelType = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
            blogName: blog.name,
            createdAt: blog.createdAt,

        }

        const insertedPost = await client.db("forum").collection("posts").insertOne(newPost)

        res.status(201).send({
            id: insertedPost.insertedId,
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: newPost.blogId,
            blogName: newPost.blogName,
            createdAt: newPost.createdAt,}
        )
    } else {
        res.sendStatus(400)
    }
}

export async function updatePost(req: Request, res: Response) {
    const postToUpdate = await client.db("forum").collection("posts").findOne({_id: new ObjectId(req.params.id)})
    if (postToUpdate) {
        const updatedPost = {
            title: req.body.title,
            createdAt: postToUpdate.createdAt,
            shortDescription : req.body.shortDescription,
            blogId: req.body.blogId,
            blogName : postToUpdate.blogName,
            content : req.body.content,
        }
        await client.db("forum")
            .collection("posts")
            .updateOne({_id: new ObjectId(req.params.id)},
                {$set: {title : updatedPost.title,
                        shortDescription : updatedPost.shortDescription,
                        blogId : updatedPost.blogId,
                        content : updatedPost.content
                    }})
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
}

export async function deleteAllPosts() {
    await client.db("forum").collection<PostViewModelType>("posts").deleteMany({})
}

export const PostValidationErrors = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    const result = {
        errorsMessages: errors.array().map(error => {
            return {message: error.msg, field: error.param}
        })
    }

    const foundBlog = await client.db("forum").collection<PostViewModelType>("blogs").findOne({_id : new ObjectId(req.body.blogId)})
    if(foundBlog === null){
        result.errorsMessages.push({message: "No blogs with such id in database", field: "blogId"})
    }
    if (!errors.isEmpty()) {
        res.status(400).send(result)
    } else {
        next()
    }
}
