import {
    BlogInsertModelType,
    BlogViewModelType,
    PostInsertModelType,
    PostViewDBModelType,
    PostViewModelType
} from "./appTypes";
import {NextFunction, Request, Response} from "express";
import {header, validationResult} from "express-validator";
import {ObjectId} from "mongodb";

export function createNewBlogId(array : BlogViewModelType[]) {
    return (array.length + 1).toString()
}

export const basicAuthGuardMiddleware  = (req : Request, res: Response, next : NextFunction) => {
    if(req.headers.authorization){
        const encoded : string = req.headers.authorization.split(" ")[1]
        const encodeway = req.headers.authorization.split(" ")[0];
        const decoded : string = Buffer.from(encoded, 'base64').toString('utf8');
        if(decoded === "admin:qwerty" && encodeway === "Basic"){
            next()
        }else{
            res.sendStatus(401)
        }
    }else {
        res.sendStatus(401)
    }
}

export const ValidationErrors = (req: Request, res : Response, next : NextFunction) => {
    const errors = validationResult(req)
    //console.log(errors, 'errors in middleware')
    if(!errors.isEmpty()){
        res.status(400).send({errorsMessages : errors.array().map(error  => {return {message: error.msg, field: error.param}})})
    } else {
        next()
    }
}



export const mongoBlogSlicing = ( Obj2: BlogViewModelType) =>  {
    return {
        id : Obj2._id,
        name:	Obj2.name,
        description: Obj2.description,
        websiteUrl: Obj2.websiteUrl,
        isMembership: Obj2.isMembership,
        createdAt : Obj2.createdAt
    }
}

export const mongoPostSlicing = ( Obj2: PostViewDBModelType) =>  {
    return {
        id : Obj2._id,
        title:	Obj2.title,
        shortDescription: Obj2.shortDescription,
        content: Obj2.content,
        blogId: Obj2.blogId,
        blogName:	Obj2.blogName,
        createdAt : Obj2.createdAt,
    }
}