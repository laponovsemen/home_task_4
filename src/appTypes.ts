import {ObjectId} from "mongodb";
import * as cluster from "cluster";
import {randomUUID} from "crypto";

export type APIErrorResultType = {
    errorsMessages : FieldErrorType[]

}
export type FieldErrorType = {
    message: string | null, // Message with error explanation for certain field
    field : string | null // What field/property of input model has error
}
export type BlogInputModelType = {
    name : string, //maxLength: 15
    description : string,// maxLength: 500
    websiteUrl : string // maxLength: 100 pattern: ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
}
export type BlogViewModelType = {
    _id : ObjectId,
    name:	string,
    description: string,
    websiteUrl: string,
    isMembership: boolean,
    createdAt : string
}
export type BlogInsertModelType = {
    name:	string,
    description: string,
    websiteUrl: string,
    isMembership: boolean,
    createdAt : string
}
export type PostInputModelType = {
    title : 	string, //    maxLength: 30
    shortDescription: string, //maxLength: 100
    content: string, // maxLength: 1000
    blogId: string
}
export type PostViewModelType = {
    _id:	ObjectId,
    title:	string,
    shortDescription:	string,
    content:	string,
    blogId:	string,
    blogName:	string,
    createdAt : string
}

export type PostInsertModelType = {
    title:	string,
    shortDescription:	string,
    content:	string,
    blogId:	string,
    blogName:	string,
    createdAt : string
}

export type PaginatorPostViewModelType = {
    pagesCount	: number
    page: number
    pageSize: number
    totalCount: number
    items : PostViewModelType[]
}
export type PaginatorBlogViewModelType = {
    pagesCount	: number
    page: number
    pageSize: number
    totalCount: number
    items : BlogViewModelType[]
}
export type BlogsPaginationCriteriaType = {
    pageNumber : number,
    pageSize : number,
    sortBy : string,
    sortDirection : "asc" | "desc"
    searchNameTerm: string | null
}
export type PostsPaginationCriteriaType = {
    pageNumber : number,
    pageSize : number,
    sortBy : string,
    sortDirection : 1 | -1
    blogId : string
}
export type CommentsPaginationCriteriaType = {
    pageNumber : number,
    pageSize : number,
    sortBy : string,
    sortDirection : "asc" | "desc"
    postId : string
}
export type sortDirectionType  = 1 | -1
export type usersPaginationCriteriaType = {
    sortBy : string,
    sortDirection : string,
    pageNumber : number,
    pageSize : number,
    searchLoginTerm : string | null,
    searchEmailTerm : string | null,
}
export type userViewModelPaginationType = {
    pagesCount :number,
    page :number,
    pageSize :number,
    totalCount	:number,
    items : userViewModel[]
}
export type userViewModel = {
    _id:	ObjectId,
    accountData : {
        login: string,
        email: string,
        createdAt: Date,
    },
    accountConfirmationData: {
        isConfirmed : true,
        code : null,
        codeDateOfExpiary : null
    } | {
        isConfirmed : false,
        code : string,
        codeDateOfExpiary : Date
    }

}
export type userInputModel = {
    accountData : {
        login: string,
        email: string,
        createdAt: Date,
        password: string,
    },
    accountConfirmationData: {
        isConfirmed : true,
        code : null,
        codeDateOfExpiary : null
    } | {
        isConfirmed : false,
        code : string,
        codeDateOfExpiary : Date
    }

}
export type LoginInputModel = {
    loginOrEmail:	string,
    password: string,

}

export type commentInputModel = {
    content : string //string maxLength: 300 minLength: 20
}
export type commentInsertModel = {
    content: string,
    commentatorInfo: commentatorInfoType,
    createdAt:	string,
    postId : ObjectId,
}
export type commentOutputModel = {
    _id:	ObjectId,
    content: string,
    commentatorInfo: commentatorInfoType,
    createdAt:	string,
    postId : ObjectId,
}
export type commentViewModel = {
    id:	string,
    content: string,
    commentatorInfo: commentatorInfoType,
    createdAt:	string,
}
export type commentatorInfoType = {
    userId: string,
    userLogin:	string,
}

export type meViewModel = {
    email:	string,
    login:	string,
    userId:	string,
}
export type spoiledTokenType = {
    typeOfToken:	"refresh" | "access",
    token : string
}

export type DeviceViewModel = {
    ip : string,                  // string IP address of device during signing in
    title : string,               // string Device name: for example Chrome 105 (received by parsing http header "user-agent"
    lastActiveDate : string,      // string Date of the last generating of refresh/access tokens
    deviceId : ObjectId             // string Id of connected device session
}
export type DeviceInputModel = {
    ip : string,                  // string IP address of device during signing in
    title : string,               // string Device name: for example Chrome 105 (received by parsing http header "user-agent"
    lastActiveDate : string,      // string Date of the last generating of refresh/access tokens

}
export type SessionsViewModel = {
    _id : ObjectId
    userId : ObjectId
    device : DeviceViewModel
    refreshToken : string
}
export type SessionsInputModel = {
    userId : ObjectId
    device : DeviceViewModel
    refreshToken : string
}
export type RequestsInputModel = {
    ip : string,
    device : string,
    lastActiveDate : Date
}
export type RequestsOutputModel = {
    _id : ObjectId
    ip : string,
    device : string,
    lastActiveDate : Date
}




