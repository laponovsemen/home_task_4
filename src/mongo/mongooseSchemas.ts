import {ObjectId} from "mongodb";
import mongoose from 'mongoose'
import { WithId } from 'mongodb'
import {
    BlogInputModelType,
    BlogInsertModelType,
    BlogViewModelType, commentDBModel, likersInfoType,
    PostInputModelType, PostInsertModelType,
    PostViewModelType, RequestsDBModel, SessionsInputModel, userInputModel
} from "../appTypes";

//question about id
//  BLOGS MODEL

export type WithMongoId<Type> = Type & { _id: ObjectId };

export const blogSchema = new mongoose.Schema<BlogInsertModelType>({
    name:	{type : String, require : true},
    description: {type : String, require : true},
    websiteUrl: {type : String, require : true},
    isMembership: {type : Boolean, require : true},
    createdAt : {type : String, require : true}
})

export const postSchema = new mongoose.Schema<PostInsertModelType>({
    title : { type: String, require: true },          //    maxLength: 30
    shortDescription : { type: String, require: true },   //maxLength: 100
    content : { type: String, require: true },     // maxLength: 1000
    blogId : { type: String, require: true },
    blogName:	{ type: String, require: true },
    createdAt : { type: String, require: true },
})

export const userSchema = new mongoose.Schema<userInputModel>({
    accountData: {
        login: {type: String, require: true},
        email: {type: String, require: true},
        createdAt: {type: Date, require: true},
        password : {type: String, require: true},
    },
    accountConfirmationData: {
        isConfirmed: {type: Boolean, require: true},
        code: {type: String , require: true, nullable : true},
        codeDateOfExpiary: {type: Date, require: true, nullable : true},
    }
});

export const commentSchema = new mongoose.Schema<commentDBModel>({

    content: {type: String, require: true},
    commentatorInfo: {
        userId: {type: String, require: true},
        userLogin:	{type: String, require: true},
    },
    createdAt:	{type: String, require: true},
    postId : {type: ObjectId, require: true},
    likesInfo: {
        likesCount: {type :Number , require : true},//  Total likes for parent item

        dislikesCount: {type :Number , require : true} ,//    Total dislikes for parent item

        myStatus : {type :String , require : true},
        likersInfo: [{
            userId : {type :ObjectId , require : true},
            status : {type :String , require : true}
        }]
    }
});

export const sessionSchema = new mongoose.Schema<SessionsInputModel>({
    userId : {type: ObjectId, require: true},
    device : {
        ip: {type: String, require: true},                  // string IP address of device during signing in
        title: {type: String, require: true},               // string Device name: for example Chrome 105 (received by parsing http header "user-agent"
        lastActiveDate: {type: String, require: true},      // string Date of the last generating of refresh/access tokens
        deviceId: {type: String, require: true}           // string Id of connected device session
    },
    refreshToken : {type: String, require: true},

});

export const requestsSchema = new mongoose.Schema<RequestsDBModel>({
    ip : {type: String, require: true},
    device : {type: String, require: true},
    lastActiveDate : {type: Date, require: true},
    baseUrl : {type: String, require: true},

});

export const blogsModel = mongoose.model<BlogViewModelType>('blogs', blogSchema)
export const postsModel = mongoose.model<PostInsertModelType>('posts', postSchema)

export const usersModel = mongoose.model<userInputModel>('users', userSchema)
export const commentsModel = mongoose.model<commentDBModel>('comments', commentSchema)
export const sessionModel = mongoose.model<SessionsInputModel>('sessions', sessionSchema)
export const requestsModel = mongoose.model<RequestsDBModel>('requests', requestsSchema)

