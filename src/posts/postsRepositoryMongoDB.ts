import {
    PostsPaginationCriteriaType,
    PaginatorPostViewModelType,
    PostInsertModelType,
    PostViewModelType,
    PostInputModelType, BlogViewModelType, BlogsPaginationCriteriaType, CommentsPaginationCriteriaType
} from "../appTypes";
import {NextFunction, Request, Response} from "express";

import {client} from "../db";
import {mongoBlogSlicing, mongoCommentSlicing, mongoPostSlicing} from "../common";
import {blogsCollectionOutput} from "../blogs/blogsRepositoryMongoDB";
import {ObjectId, Sort, WithId} from "mongodb";
import {validationResult} from "express-validator";
import {commentsCollectionOutput} from "../comments/commentsDomain";

const postCollectionInsert = client.db("forum").collection<PostInsertModelType>("posts")
const postCollectionOutput = client.db("forum").collection<PostViewModelType>("posts")
export async function getPostById(req: Request, res: Response) {
    const blogId = req.params.id
    if(blogId) {
        const result = await postCollectionOutput.findOne({_id: new ObjectId(blogId)})
        if(result) {
            res.status(200).send(mongoPostSlicing(result))
        } else {
            res.sendStatus(404)
        }
    } else {
        res.sendStatus(404)
    }
}
export async function getAllPostsDB(postsPagination : BlogsPaginationCriteriaType) {

    const pageSize = postsPagination.pageSize
    const totalCount = await postCollectionOutput.countDocuments({})
    const pagesCount = Math.ceil(totalCount / pageSize)
    const page = postsPagination.pageNumber
    const sortBy = postsPagination.sortBy
    const sortDirection : "asc" | "desc"  = postsPagination.sortDirection
    const ToSkip = (postsPagination.pageSize * (postsPagination.pageNumber - 1))



    const result = await postCollectionOutput
        .find({})  //
        .sort({[sortBy] : sortDirection})
        .skip(ToSkip)
        .limit(pageSize)
        .toArray()
    return {
        pageSize : pageSize,
        totalCount : totalCount,
        pagesCount : pagesCount,
        page : page,
        items : result.map(item => mongoPostSlicing(item))
    }

}
export async function getAllCommentsForSpecifiedPostDB(postsPagination : CommentsPaginationCriteriaType) {
    const postId = postsPagination.postId
    const pageSize = postsPagination.pageSize
    const totalCount = await postCollectionOutput.countDocuments({})
    const pagesCount = Math.ceil(totalCount / pageSize)
    const page = postsPagination.pageNumber
    const sortBy = postsPagination.sortBy
    const sortDirection : "asc" | "desc"  = postsPagination.sortDirection
    const ToSkip = (postsPagination.pageSize * (postsPagination.pageNumber - 1))



    const result = await commentsCollectionOutput
        .find({postId : new ObjectId(postId)})  //
        .sort({[sortBy] : sortDirection})
        .skip(ToSkip)
        .limit(pageSize)
        .toArray()
    return {
        pageSize : pageSize,
        totalCount : totalCount,
        pagesCount : pagesCount,
        page : page,
        items : result.map(item => mongoCommentSlicing(item))
    }

}

export async function getAllPostsForSpecificBlogDB(PaginationCriteria : PostsPaginationCriteriaType) {
    const pageSize = PaginationCriteria.pageSize
    const totalCount = await postCollectionOutput.countDocuments({blogId : PaginationCriteria.blogId})
    const pagesCount = Math.ceil(totalCount / pageSize)
    const page = PaginationCriteria["pageNumber"]
    const sortBy = PaginationCriteria.sortBy
    const sortDirection : 1 | -1  = PaginationCriteria.sortDirection

    const foundItems = await postCollectionOutput
        .find({blogId : PaginationCriteria.blogId})
        .sort({[sortBy] : sortDirection}) //{createdAt: 1}
        .skip((PaginationCriteria.pageNumber - 1) * pageSize)
        .limit(pageSize)
        .toArray()
    return {
        pageSize : pageSize,
        totalCount : totalCount,
        pagesCount : pagesCount,
        page : page,
        items : foundItems.map(item => mongoPostSlicing(item))
    }

}

export async function deletePostById(req: Request, res: Response) {
    const deletedPost = await postCollectionOutput.deleteOne({_id: new ObjectId(req.params.id)})
    if(deletedPost.deletedCount === 0){
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }

}

export async function createPost(req: Request, res: Response) {
    const blog = await blogsCollectionOutput.findOne({_id : new ObjectId(req.body.blogId)})
    if(blog) {
        const newPost: PostInsertModelType = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString(),

        }

        const insertedPost = await postCollectionInsert.insertOne(newPost)

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
        await postCollectionInsert
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

    const foundBlog = await blogsCollectionOutput.findOne({_id : new ObjectId(req.body.blogId)})
    if(foundBlog === null){
        result.errorsMessages.push({message: "No blogs with such id in database", field: "blogId"})
    }
    if (!errors.isEmpty()) {
        res.status(400).send(result)
    } else {
        next()
    }
}

export async function createPostForSpecificBlogDB (newPost : PostInputModelType) {
    const title = 	newPost.title
    const shortDescription = 	newPost.shortDescription
    const content = 	newPost.content
    const blogId = 	newPost.blogId
    const blog = await blogsCollectionOutput.findOne({_id : new ObjectId(blogId)})
    // @ts-ignore
    const blogName = blog.name
    const createdAt  = new Date().toISOString()

    const createdPost = await postCollectionInsert.insertOne({
        title : title,
        shortDescription : shortDescription,
        content : content,
        blogId : blogId ,
        blogName : blogName,
        createdAt : createdAt
    })
    return {
        id : createdPost.insertedId,
        title : title,
        shortDescription : shortDescription,
        content : content,
        blogId : blogId ,
        blogName : blogName,
        createdAt : createdAt
    }
}

export async function findPostById(postId : string){
    const postExistance = await postCollectionOutput.findOne({_id : new ObjectId(postId)})
    return !!postExistance
}
