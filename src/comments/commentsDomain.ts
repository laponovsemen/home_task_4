import {Request, Response} from "express";
import {client} from "../db";
import {commentInsertModel, commentViewModel} from "../appTypes";

const commentsCollectionInsert = client.db("forum").collection<commentInsertModel>("comments")
const commentsCollectionOutput = client.db("forum").collection<commentViewModel>("comments")
export async function  updateCommentById(req: Request, res : Response) {

}

export async function  deleteCommentById(req: Request, res : Response) {

}
export async function  getCommentById(req: Request, res : Response) {

}
export async function  createCommentForSpecifiedPost(req: Request, res : Response) {

    const content = req.body.content
    const commentatorInfo = {
        userId: req.body.user.id,
        userLogin: req.body.user.login
    }
    const createdAt = new Date().toISOString()

    const newComment:commentInsertModel  =  {
        content: content,
        commentatorInfo: commentatorInfo,
        createdAt: createdAt
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