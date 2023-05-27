import {
    BlogsPaginationCriteriaType,
    CommentsPaginationCriteriaType,
    parentModel,
    PostDBModel,
    PostInputModelType,
    PostsPaginationCriteriaType,
    statusType
} from "../appTypes";
import {NextFunction, Request, Response} from "express";
import {ObjectId} from "mongodb";
import {validationResult} from "express-validator";
import {blogsModel, commentsModel, likesModel, postsModel} from "../mongo/mongooseSchemas";
import {Common} from "../common";
import {JwtService} from "../jwtDomain";
import {LikesRepository} from "../likesRepositoryMongoDB";

export class PostsRepository {
    constructor(protected common : Common,
                protected jwtService : JwtService,
                protected likesRepository : LikesRepository) {
    }

    async getPostById(req: Request, res: Response) {
        const postId = req.params.id
        if (postId) {
            const result = await postsModel.findOne({_id: new ObjectId(postId)})
            if (result) {
                let myStatus : statusType
                if(!req.headers.authorization){
                    myStatus = statusType.None
                } else {
                    const userId = await this.jwtService.getUserIdByToken(req.headers.authorization.split(" ")[1])

                    myStatus = await this.likesRepository.getMyLikeStatusForPost(userId!, new ObjectId(postId))
                }
                const foundPost = this.common.mongoPostSlicing(result)

                foundPost.extendedLikesInfo.myStatus = myStatus
                res.status(200).send()
            } else {
                res.sendStatus(404)
            }
        } else {
            res.sendStatus(404)
        }
    }
    /*async findUserInLikeInfoByObjectId(postId: string, userId : ObjectId) {
        const post = await postsModel.findOne({_id: new ObjectId(postId)})
        //const likersInfo =

        const likerInfo = post!.extendedLikesInfo.likersInfo.find((likes) => {return (likes.userId.toString() === userId.toString())})
        //console.log(likerInfo + "likerInfo")
        //console.log(post!.extendedLikesInfo + "post!.extendedLikesInfo")
        return !!likerInfo;
    }
    async pushUserToLikersInfo(userId : string, postId : string, likeStatus : statusType, login : string) {
        const addedAt = new Date()
        const foundPost = await postsModel.findOne({_id : new ObjectId(postId)})
        foundPost!.extendedLikesInfo.likersInfo.push({
            userId : new ObjectId(userId),
            status : likeStatus,
            addedAt : addedAt,
            login : login,
        })
        await foundPost!.save()
    }
    async changeLikeStatusOfUserInLikersInfo(userId : string, postId : string, likeStatus : statusType) {
        const foundPost = await postsModel.findOne({_id : new ObjectId(postId)})
        const likersInfo = foundPost!.extendedLikesInfo.likersInfo
        for(let i = 0; i < likersInfo.length; i++){
            if(likersInfo[i].userId.toString() === userId){
                likersInfo[i].status = likeStatus
                break
            }
        }
        await foundPost!.save()
    }*/
    async updateLikesAndDislikesCounters( postId : string) {
        const foundPost = await postsModel.findOne({_id : postId})
        const foundLikesForSpecificPost = await likesModel.find({$and : [{ parentId : new ObjectId(postId)},
                {parentType : parentModel.post}]}).lean().exec()
        let likesCounter = 0
        let dislikesCounter = 0
        for(let i = 0; i < foundLikesForSpecificPost.length; i++){
            if(foundLikesForSpecificPost[i].status === statusType.Like)  likesCounter++ ;
            if(foundLikesForSpecificPost[i].status === statusType.Dislike)  dislikesCounter++ ;
        }
        foundPost!.extendedLikesInfo.likesCount = likesCounter
        foundPost!.extendedLikesInfo.dislikesCount = dislikesCounter
        await postsModel.updateOne({_id : postId}, {
            $set:
                {
                    "extendedLikesInfo.likesCount": 1000,
                    "extendedLikesInfo.dislikesCount": dislikesCounter
                }
        })
    }
    async updateNewestLikes( postId : string) {
        const foundPost = await postsModel.findOne({_id : new ObjectId(postId)})
        const likesFilter = {$and :[{parentId : new ObjectId(postId)}, {parentType : parentModel.post}]}
        const newestLikesToUpdate = await likesModel.find(likesFilter).sort({addedAt : "asc"}).limit(3)

        foundPost!.extendedLikesInfo.newestLikes = newestLikesToUpdate
        await foundPost!.save()
        console.log(newestLikesToUpdate, " newestLikesToUpdate")
        console.log(foundPost!.extendedLikesInfo.newestLikes + "newestLikes")

    }

    async getAllPostsDB(postsPagination: BlogsPaginationCriteriaType) {

        const pageSize = postsPagination.pageSize
        const totalCount = await postsModel.countDocuments({})
        const pagesCount = Math.ceil(totalCount / pageSize)
        const page = postsPagination.pageNumber
        const sortBy = postsPagination.sortBy
        const sortDirection: "asc" | "desc" = postsPagination.sortDirection
        const ToSkip = (postsPagination.pageSize * (postsPagination.pageNumber - 1))


        const result = await postsModel
            .find({})  //
            .sort({[sortBy]: sortDirection})
            .skip(ToSkip)
            .limit(pageSize)

        return {
            pageSize: pageSize,
            totalCount: totalCount,
            pagesCount: pagesCount,
            page: page,
            items: result.map(item => this.common.mongoPostSlicing(item))
        }

    }

    async getAllCommentsForSpecifiedPostDB(commentsPagination: CommentsPaginationCriteriaType, userId : ObjectId) {
        const postId = commentsPagination.postId
        const pageSize = commentsPagination.pageSize
        const totalCount = await commentsModel.countDocuments({postId: new ObjectId(postId)})

        if (totalCount < 1) {
            return null
        }


        const pagesCount = Math.ceil(totalCount / pageSize)
        const page = commentsPagination.pageNumber
        const sortBy = commentsPagination.sortBy
        const sortDirection: "asc" | "desc" = commentsPagination.sortDirection
        const ToSkip = (commentsPagination.pageSize * (commentsPagination.pageNumber - 1))


        const result = await commentsModel
            .find({postId: new ObjectId(postId)})  //
            .sort({[sortBy]: sortDirection})
            .skip(ToSkip)
            .limit(pageSize)
        if (result) {
            const items = result.map(item => this.common.mongoGetAllCommentsSlicing(item, userId))
            return {
                pageSize: pageSize,
                totalCount: totalCount,
                pagesCount: pagesCount,
                page: page,
                items: items
            }
        } else {
            return null
        }

    }
    async getAllPostsForSpecificBlogDB(PaginationCriteria: PostsPaginationCriteriaType) {
        const pageSize = PaginationCriteria.pageSize
        const totalCount = await postsModel.countDocuments({blogId: PaginationCriteria.blogId})
        const pagesCount = Math.ceil(totalCount / pageSize)
        const page = PaginationCriteria["pageNumber"]
        const sortBy = PaginationCriteria.sortBy
        const sortDirection: 1 | -1 = PaginationCriteria.sortDirection

        const foundItems = await postsModel
            .find({blogId: PaginationCriteria.blogId})
            .sort({[sortBy]: sortDirection}) //{createdAt: 1}
            .skip((PaginationCriteria.pageNumber - 1) * pageSize)
            .limit(pageSize)

        return {
            pageSize: pageSize,
            totalCount: totalCount,
            pagesCount: pagesCount,
            page: page,
            items: foundItems.map(this.common.mongoPostSlicing)
        }

    }

    async deletePostById(req: Request, res: Response) {
        const deletedPost = await postsModel.deleteOne({_id: new ObjectId(req.params.id)})
        if (deletedPost.deletedCount === 0) {
            res.sendStatus(404)
        } else {
            res.sendStatus(204)
        }

    }

    async createPost(req: Request, res: Response) {
        const blog = await blogsModel.findOne({_id: new ObjectId(req.body.blogId)})
        if (blog) {
            const newPost: PostDBModel = {
                title: req.body.title,
                shortDescription: req.body.shortDescription,
                content: req.body.content,
                blogId: req.body.blogId,
                blogName: blog.name,
                createdAt: new Date().toISOString(),
                extendedLikesInfo : {
                    likesCount : 0,
                    dislikesCount : 0,
                    myStatus : statusType.None,
                    newestLikes : [],
                }
            }

            const insertedPost = await postsModel.create(newPost)

            res.status(201).send({
                    id: insertedPost._id,
                    title: newPost.title,
                    shortDescription: newPost.shortDescription,
                    content: newPost.content,
                    blogId: newPost.blogId,
                    blogName: newPost.blogName,
                    createdAt: newPost.createdAt,
                    extendedLikesInfo: {
                        likesCount: 0,
                        dislikesCount: 0,
                        myStatus: statusType.None,
                        newestLikes: []
                    }
                }
            )
        } else {
            res.sendStatus(400)
        }
    }
    async updatePost(req: Request, res: Response) {
        const postToUpdate = await postsModel.findOne({_id: new ObjectId(req.params.id)})
        if (postToUpdate) {
            await postsModel
                .updateOne({_id: new ObjectId(req.params.id)},
                    {
                        title: req.body.title,
                        shortDescription: req.body.shortDescription,
                        blogId: req.body.blogId,
                        content: req.body.content
                    })
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }

    async deleteAllPosts() {
        await postsModel.deleteMany({})
    }
    PostValidationErrors = async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req)
        const result = {
            errorsMessages: errors.array().map(error => {
                return {message: error.msg, field: error.param}
            })
        }

        const foundBlog = await blogsModel.findOne({_id: new ObjectId(req.body.blogId)})
        if (foundBlog === null) {
            result.errorsMessages.push({message: "No blogs with such id in database", field: "blogId"})
        }
        if (!errors.isEmpty()) {
            res.status(400).send(result)
        } else {
            next()
        }
    }
    async createPostForSpecificBlogDB(newPost: PostInputModelType) {
        const title = newPost.title
        const shortDescription = newPost.shortDescription
        const content = newPost.content
        const blogId = newPost.blogId
        const blog = await blogsModel.findOne({_id: new ObjectId(blogId)})
        // @ts-ignore
        const blogName = blog.name
        const createdAt = new Date().toISOString()

        const createdPost = await postsModel.collection.insertOne({
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: blogName,
            createdAt: createdAt,
            extendedLikesInfo : {
                likesCount : 0,
                dislikesCount : 0,
                myStatus : statusType.None,
                newestLikes : [],
                likersInfo : []
            }
        })
        return {
            id: createdPost.insertedId,
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: blogName,
            createdAt: createdAt,
            extendedLikesInfo : {
                likesCount : 0,
                dislikesCount : 0,
                myStatus : statusType.None,
                newestLikes : []
            }
        }
    }

    async findPostById(postId: string) {
        const postExistance = await postsModel.findOne({_id: new ObjectId(postId)})
        return !!postExistance
    }
}
