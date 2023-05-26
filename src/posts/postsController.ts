import {Request, Response} from "express";
import {BlogsPaginationCriteriaType} from "../appTypes";
import {PostsRepository} from "./postsRepositoryMongoDB";
import {commentsModel, postsModel} from "../mongo/mongooseSchemas";
import {ObjectId} from "mongodb";
import {JwtService} from "../jwtDomain";


export class PostsController {
    constructor(protected postsRepository : PostsRepository,
                protected jwtService : JwtService) {
    }
    async getAllPosts(req: Request, res: Response) {
        const searchNameTerm = req.query.searchNameTerm ? req.query.searchNameTerm.toString() : null
        const pageNumber: number = req.query.pageNumber ? parseInt(req.query.pageNumber.toString(), 10) : 1
        const pageSize: number = req.query.pageSize ? parseInt(req.query.pageSize.toString(), 10) : 10
        const sortBy: string = req.query.sortBy ? req.query.sortBy.toString() : "createdAt"
        const sortDirection: "asc" | "desc" = req.query.sortDirection === "asc" ? "asc" : "desc"
        // controller не должкен знать о всех бизнес движениях
        const PaginationCriteria: BlogsPaginationCriteriaType = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            sortBy: sortBy,
            sortDirection: sortDirection,
            searchNameTerm: searchNameTerm
        }
        const result = await this.postsRepository.getAllPostsDB(PaginationCriteria)
        res.send(result).status(200)
    }
    async changeLikeStatusOfPost(req: Request, res: Response) {
        const postId = req.params.id
        const likeStatus = req.body.likeStatus
        const foundPost = await postsModel.findOne({_id: new ObjectId(postId)})
        if (foundPost) {
            const userId = await this.jwtService.getUserIdByToken(req.headers.authorization!.split(" ")[1])
            const userlogin = await this.jwtService.getUserLoginByToken(req.headers.authorization!.split(" ")[1])
            if(userId){
                const userAlreadyLikedPost = await this.postsRepository.findUserInLikeInfoByObjectId(postId, userId)
                if(!userAlreadyLikedPost){
                    const addUsertoLikersInfo = await this.postsRepository.pushUserToLikersInfo(userId!.toString(),
                        postId,
                        likeStatus,
                        userlogin)
                } else {
                    const updatedUserinLikersInfo = await this.postsRepository.changeLikeStatusOfUserInLikersInfo(userId!.toString(),
                        postId,
                        likeStatus)
                }

                await this.postsRepository.updateLikesAndDislikesCounters(postId)
                res.sendStatus(204)
            } else {
                console.log("user is not found by id")
                res.sendStatus(401)
            }
        } else {
            console.log("comment is not found by id")
            res.sendStatus(404)
        }
    }
}