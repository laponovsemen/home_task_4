import { commentsModel} from "../mongo/mongooseSchemas";
import {ObjectId} from "mongodb";
import {commentDBModel, statusType} from "../appTypes";

export class CommentsRepository {
    async deleteAllComments() {
        await commentsModel.deleteMany({})
    }
    async findUserInLikeInfoByObjectId(commentId: string, userId : ObjectId) {
        const comment = await commentsModel.findOne({_id: new ObjectId(commentId)})
        const likerInfo = comment!.likesInfo.likersInfo//.find( (likes) => {return (likes.userId.toString() === userId.toString())})
        console.log(likerInfo)
        return !!likerInfo;
    }
    async pushUserToLikersInfo(userId : string, commentId : string, likeStatus : statusType ) {
        const foundComment = await commentsModel.findOne({_id : new ObjectId(commentId)})
        foundComment!.likesInfo.likersInfo.push({userId : new ObjectId(userId) , status : likeStatus})
        await foundComment!.save()
    }
    async changeLikeStatusOfUserInLikersInfo(userId : string, commentId : string,likeStatus : statusType ) {
        const foundComment = await commentsModel.findOne({_id : new ObjectId(commentId)})
        const likersInfo = foundComment!.likesInfo.likersInfo
        for(let i = 0; i < likersInfo.length; i++){
            if(likersInfo[i].userId.toString() === userId){
                likersInfo[i].status = likeStatus
                break
            }
        }
        await foundComment!.save()
    }
    async updateLikesAndDislikesCounters( commentId : string) {
        const foundComment = await commentsModel.findOne({_id : new ObjectId(commentId)})
        const likersInfo = foundComment!.likesInfo.likersInfo
        let likesCounter = 0
        let dislikesCounter = 0
        for(let i = 0; i < likersInfo.length; i++){
            if(likersInfo[i].status === statusType.Like)  likesCounter++ ;
            if(likersInfo[i].status === statusType.Dislike)  dislikesCounter++ ;

        }
        foundComment!.likesInfo.likesCount = likesCounter
        foundComment!.likesInfo.dislikesCount = dislikesCounter
        await foundComment!.save()
    }
}