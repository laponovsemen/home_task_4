import {
    BlogInsertModelType,
    PostInsertModelType,
    BlogViewModelType,
    PostViewModelType,
    BlogsPaginationCriteriaType
} from "../appTypes";
import {NextFunction, Request, Response} from "express";
import {createNewBlogId, mongoBlogSlicing, mongoPostSlicing} from "../common";
import {client} from "../db";
import {ObjectId} from "mongodb";



export const blogsCollectionInsert = client.db("forum").collection<BlogInsertModelType>("blogs")
export const blogsCollectionOutput = client.db("forum").collection<BlogViewModelType>("blogs")
export async function getBlogById(req: Request, res: Response) {
     if(req.params.id) {
        const mongoBlog = await blogsCollectionOutput
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
export async function getAllBlogsDB(BlogsPagination : BlogsPaginationCriteriaType) {
    const pageSize = BlogsPagination.pageSize
    const totalCount = await blogsCollectionOutput.countDocuments({})
    const pagesCount = Math.ceil(totalCount / pageSize)
    const page = BlogsPagination.pageNumber
    const sortBy = BlogsPagination.sortBy
    const sortDirection : "asc" | "desc"  = BlogsPagination.sortDirection
    const ToSkip = (BlogsPagination.pageSize * (pagesCount - 1)) > 0 ? BlogsPagination.pageSize * (pagesCount - 1) : 0
    const result = await blogsCollectionOutput
        .find({})  //name : { $regex : /BlogsPagination.searchNameTerm/}
        .sort({sortBy : sortDirection})
        .skip(ToSkip)
        .limit(pageSize)
        .toArray()
    return {
        pageSize : pageSize,
        totalCount : totalCount,
        pagesCount : pagesCount,
        page : page,
        items : result.map(item => mongoBlogSlicing(item))
    }



    //{ projection: { name : 0}}


    return result
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

    const result = await blogsCollectionInsert.insertOne(newBlog)  // Need to check / bad decision

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

export async function CheckingForBlogExistance(blogId : string) : Promise<boolean> {
    const foundBlog = await blogsCollectionOutput.findOne({_id : new ObjectId(blogId)})
    if(foundBlog){
        return true
    } else {
        return false
    }
}







