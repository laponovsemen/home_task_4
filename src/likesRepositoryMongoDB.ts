import {ObjectId} from "mongodb";
import {likesModel} from "./mongo/mongooseSchemas";
import {parentModel, statusType} from "./appTypes";


export class LikesRepository {
    constructor(){

    }
    async findUserInPostLikeInfoByObjectId(postId : ObjectId, userId : ObjectId){
        const filter = {$and : [{parentId : postId}, {userId}]}
        return likesModel.findOne(filter);
    }
    async pushUserToPostLikersInfo(userId :ObjectId, postId :ObjectId,  likeStatus : statusType, userlogin : string){
        return likesModel.create({
            parentId: postId,
            parentType : parentModel.post,
            addedAt : new Date(),
            userId ,
            login : userlogin,
            status : likeStatus,
        });
    }
    async getMyLikeStatusForPost(userId :ObjectId, postId :ObjectId){
        const filter = {$and :[{userId},{parentId : postId}, {parentType : parentModel.post}]}
        const result = await likesModel.findOne(filter)
        if(result){
            return result.status
        } else {
            return statusType.None
        }
    }
    async changeLikeStatusOfUserInPostLikersInfo(userId :ObjectId, postId :ObjectId,  likeStatus : statusType){

        const updatedLike = await  likesModel.updateOne({
            parentId: postId,
            parentType : parentModel.post,
            userId },
            {$set : {
                    status: likeStatus,
                }
        });
    }
}