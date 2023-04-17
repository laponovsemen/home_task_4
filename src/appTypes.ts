import {ObjectId} from "mongodb";

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
