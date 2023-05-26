import {
    BlogInsertModelType,
    PostDBModel,
    BlogViewModelType,
    PostViewModelType,
    BlogsPaginationCriteriaType
} from "../appTypes";
import {NextFunction, Request, Response} from "express";
import {ObjectId} from "mongodb";
import {blogsModel} from "../mongo/mongooseSchemas";
import {Common} from "../common";


export class BlogsRepository {
    constructor(protected common : Common) {
    }
    async getBlogById(req: Request, res: Response) {
        if (req.params.id) {
            const mongoBlog = await blogsModel
                .findOne({_id: new ObjectId(req.params.id)},
                    {projection: {id: 1, name: 1, description: 1, websiteUrl: 1, isMembership: 1, createdAt: 1}})
            if (mongoBlog) {

                res.status(200).send(this.common.mongoBlogSlicing(mongoBlog))
            } else {
                res.sendStatus(404)
            }

        } else {
            res.sendStatus(404)
        }
    }

    async getAllBlogsDB(blogsPagination: BlogsPaginationCriteriaType) {
        const filter: { name?: any } = {}
        if (blogsPagination.searchNameTerm) {
            filter.name = {$regex: blogsPagination.searchNameTerm, $options: 'i'}
        }
        const pageSize = blogsPagination.pageSize
        const totalCount = await blogsModel.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / pageSize)
        const page = blogsPagination.pageNumber
        const sortBy = blogsPagination.sortBy
        const sortDirection: "asc" | "desc" = blogsPagination.sortDirection
        const ToSkip = (blogsPagination.pageSize * (blogsPagination.pageNumber - 1))

        const result = await blogsModel
            .find(filter)  //
            .sort({[sortBy]: sortDirection})
            .skip(ToSkip)
            .limit(pageSize)

        return {
            pagesCount: pagesCount,
            page: page,
            pageSize: pageSize,
            totalCount: totalCount,
            items: result.map(item => this.common.mongoBlogSlicing(item))
        }


        return result
    }

    async deleteBlogById(req: Request, res: Response) {
        if (req.params.id) {
            const result = await blogsModel.deleteOne({_id: new ObjectId(req.params.id)})
            if (result.deletedCount === 1) {
                res.sendStatus(204)
            } else {
                res.sendStatus(404)
            }
        } else {
            res.sendStatus(404)
        }
        //  SELECT id, name, description, webUrl FROM blogs

    }

    async createBlog(req: Request, res: Response) {

        const newBlog = {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,
        }

        const result = await blogsModel.collection.insertOne(newBlog)  // Need to check / bad decision

        res.status(201).send({
            id: result.insertedId,
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: newBlog.createdAt,
            isMembership: newBlog.isMembership,
        })
    }

    async deleteAllBlogs() {
        await blogsModel.deleteMany({})

    }

    async updateBlog(req: Request, res: Response) {
        const blogToUpdate = await blogsModel.findOne({_id: new ObjectId(req.params.id)})
        if (blogToUpdate) {
            const updatedBlog = {
                id: req.params.id,
                name: req.body.name,
                description: req.body.description,
                websiteUrl: req.body.websiteUrl,
                createdAt: blogToUpdate.createdAt,
                isMembership: blogToUpdate.isMembership,
            }
            await blogsModel
                .updateOne({_id: new ObjectId(req.params.id)}, {
                    $set: {
                        name: updatedBlog.name,
                        description: updatedBlog.description,
                        websiteUrl: updatedBlog.websiteUrl
                    }
                })

            res.status(204).send(updatedBlog)
        } else {
            res.sendStatus(404)
        }

    }

    async CheckingForBlogExistance(blogId: string): Promise<boolean> {
        const foundBlog = await blogsModel.findOne({_id: new ObjectId(blogId)})
        if (foundBlog) {
            return true
        } else {
            return false
        }
    }
}







