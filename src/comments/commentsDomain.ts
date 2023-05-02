import {Request, Response} from "express";
import {client} from "../db";
import {commentatorInfoType, commentInsertModel, commentOutputModel, commentViewModel} from "../appTypes";
import {ObjectId} from "mongodb";
import {mongoCommentSlicing, mongoUserSlicing} from "../common";

const commentsCollectionInsert = client.db("forum").collection<commentInsertModel>("comments")
const commentsCollectionOutput = client.db("forum").collection<commentOutputModel>("comments")
export async function  updateCommentById(req: Request, res : Response) {
    const commentId = req.params.id
    const foundComment = await commentsCollectionOutput.findOne({_id: new ObjectId(commentId)})
    if(foundComment){
        if(foundComment.commentatorInfo.userId.toString() !== req.body.user.id.toString()){
            res.sendStatus(403)
        }
        const updatedComment = await commentsCollectionInsert.updateOne({_id: new ObjectId(commentId)},
            {$set:
                    {content: req.body.content,
                        commentatorInfo: foundComment.commentatorInfo,
                        createdAt:	foundComment.createdAt,
                        postId : foundComment.postId,
            }})
        if(updatedComment.modifiedCount === 1){
            res.status(204)
        }else {
            res.sendStatus(404)
        }

    } else {

    }
}

export async function  deleteCommentById(req: Request, res : Response) {
    const commentId = req.params.id
    const foundComment = await commentsCollectionOutput.findOne({_id: new ObjectId(commentId)})
    if(foundComment){
        if(foundComment.commentatorInfo.userId.toString() !== req.body.user.id.toString()){
            res.sendStatus(403)
        }
        res.status(200).send(mongoCommentSlicing(foundComment))
    } else {
        res.sendStatus(404)
    }
}
export async function  getCommentById(req: Request, res : Response) {
    const commentId = req.params.id
    const foundComment = await commentsCollectionOutput.findOne({_id: new ObjectId(commentId)})
    if(foundComment){
        res.status(200).send(mongoCommentSlicing(foundComment))
    } else {
        res.sendStatus(404)
    }
}
export async function  createCommentForSpecifiedPost(req: Request, res : Response) {

    const content = req.body.content
    const commentatorInfo = {
        userId: req.body.user.id,
        userLogin: req.body.user.login
    }
    const createdAt = new Date().toISOString()

    const newComment  =  {
        content: content,
        commentatorInfo: commentatorInfo,
        createdAt: createdAt,
        postId : req.params.id
    }
    const insertedComment = await commentsCollectionInsert.insertOne(newComment)
    res.status(201).send({
        id: insertedComment.insertedId,
        content: content,
        commentatorInfo: commentatorInfo,
        createdAt: createdAt
    })
}
export async function  getAllCommentsForSpecifiedPost(req: Request, res : Response) {

}