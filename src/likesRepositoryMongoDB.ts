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