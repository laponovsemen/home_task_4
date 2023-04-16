import {
    BlogInsertModelType,
    PostInsertModelType,
    BlogViewModelType,
    PostViewModelType,
    getAllPostsForSpecificBlogType, PaginatorBlogViewModelType, PostInputModelType
} from "../appTypes";
import {NextFunction, Request, Response} from "express";
import {createNewBlogId, mongoBlogSlicing} from "../common";
import {client} from "../db";
import {ObjectId} from "mongodb";



export let blogsCollection = client.db("forum").collection<BlogViewModelType>("blogs")
export async function getBlogById(req: Request, res: Response) {
    if(req.params.id) {
        const mongoBlog = await blogsCollection
            .findOne({_id: new ObjectId(req.params.id)},
                {projection : {id : 1, name: 1,description: 1, websiteUrl: 1, isMembership: 1, createdAt: 1}})
        if(mongoBlog){

            res.status(200).send(mongoBlogSlicing(mongoBlog))
        }else{
            res.sendStatus(404)
        }

    } else {
        res.sendStatus(404)
    }
}
export async function getAllBlogs(req: Request, res: Response) {
    const result = await blogsCollection.find({}).toArray()  //{ projection: { name : 0}}
    res.status(200).send(result.map(blog => mongoBlogSlicing(blog)))
}

export async function deleteBlogById(req: Request, res: Response) {
    if(req.params.id){
        const result = await client.db("forum").collection("blogs").deleteOne({_id: new ObjectId(req.params.id)})
        if(result.deletedCount === 1){
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    } else {
        res.sendStatus(404)
    }
    //  SELECT id, name, description, webUrl FROM blogs

}

export async function createBlog(req: Request, res: Response) {

    const newBlog = {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
        createdAt: new Date().toISOString(),
        isMembership: false,
    }

    const result = await client.db("forum").collection<BlogInsertModelType>("blogs").insertOne(newBlog)  // Need to check / bad decision

    res.status(201).send({
        id: result.insertedId,
        name: newBlog.name,
        description: newBlog.description,
        websiteUrl: newBlog.websiteUrl,
        createdAt: newBlog.createdAt,
        isMembership: newBlog.isMembership,
    })
}

export async function deleteAllBlogs() {
    await client.db("forum").collection<BlogViewModelType>("blogs").deleteMany({})

}

export async function updateBlog(req: Request, res: Response) {
    const blogToUpdate = await client.db("forum").collection<BlogViewModelType>("blogs").findOne({_id : new ObjectId(req.params.id)})
    if(blogToUpdate) {
        const updatedBlog = {
            id: req.params.id,
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl,
            createdAt: blogToUpdate.createdAt,
            isMembership: blogToUpdate.isMembership,
        }
        await client.db("forum")
            .collection("blogs")
            .updateOne( { _id : new ObjectId(req.params.id) },{ $set: {
                    name : updatedBlog.name,
                    description : updatedBlog.description,
                    websiteUrl : updatedBlog.websiteUrl
                }})

        res.status(204).send(updatedBlog)
    } else {
        res.sendStatus(404)
    }

}

export async function getAllPostsForSpecificBlogDB(PagCriteria : getAllPostsForSpecificBlogType) {
    const foundBlog = await blogsCollection.findOne({_id: new ObjectId(PagCriteria.blogId)})
    if (!foundBlog) {
        return {status: 404, items: null}
    } else {
        const totalCount = await blogsCollection.find({blogId : foundBlog._id}).count({})
        const pageSize = PagCriteria.pageSize
        const pagesCount = Math.ceil(totalCount / pageSize)
        const page = PagCriteria.pageNumber
        const foundItems = await blogsCollection.find({blogId : foundBlog._id}).skip((page - 1) * pageSize).limit(pageSize).toArray()
        const SealedFoundItems: PaginatorBlogViewModelType = {
            pagesCount: pagesCount,
            page: page,
            pageSize: pageSize,
            totalCount: totalCount,
            items: foundItems
        }
        return {status: 200, items: SealedFoundItems}
    }
}








