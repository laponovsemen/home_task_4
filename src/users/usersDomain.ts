import {Request, Response} from "express";
import {
    PostInsertModelType,
    sortDirectionType,
    userInputModel,
    usersPaginationCriteriaType,
    userViewModel
} from "../appTypes";
import {findUserByIdDB, getAllUsersDB} from "./usersRepositoryMongoDB";
import {client} from "../db";
import {randomUUID} from "crypto";
import {ObjectId} from "mongodb";
import {mongoUserSlicing} from "../common";

export const usersCollectionInsert = client.db("forum").collection<userInputModel>("users")
export const usersCollectionOutput = client.db("forum").collection<userViewModel>("users")

export async function getAllUsers(req: Request, res:Response) {
    const sortBy : string = req.query.sortBy ? req.query.sortBy.toString() : "createdAt"
    const sortDirection : string = req.query.sortDirection ? req.query.sortDirection.toString() : "desc"
    const pageNumber : number = req.query.pageNumber ? parseInt(req.query.pageNumber.toString(), 10) : 1
    const pageSize : number = req.query.pageSize ? parseInt(req.query.pageSize.toString(), 10) : 10
    const searchLoginTerm : string | null = req.query.searchLoginTerm ? req.query.searchLoginTerm.toString() : null
    const searchEmailTerm : string | null = req.query.searchEmailTerm ? req.query.searchEmailTerm.toString() : null
    const usersPaginationCriteria : usersPaginationCriteriaType = {
        sortBy : sortBy,
        sortDirection : sortDirection,
        pageNumber : pageNumber,
        pageSize : pageSize,
        searchLoginTerm : searchLoginTerm,
        searchEmailTerm : searchEmailTerm,
    }
    const result = await getAllUsersDB(usersPaginationCriteria)
    res.send(result).status(200)

}

export async function createUser(req: Request, res:Response) {
    const login : string = req.body.login
    const email : string = req.body.email
    const password : string = req.body.password
    const dateOfCreation = new Date()
    const newCreatedUser = await usersCollectionInsert.insertOne({


        accountData : {
            login : login,
            email : email,
            password : password,
            createdAt: dateOfCreation
        },
        accountConfirmationData: {
            isConfirmed : true,
            code : null,
            codeDateOfExpiary : null
        }
    })
    res.status(201).send({
        id : newCreatedUser.insertedId,
        login : login,
        email : email,
        createdAt: dateOfCreation
    })
}

export async function deleteUserById(req: Request, res:Response) {
    const deletedUser = await usersCollectionOutput.deleteOne({_id : new ObjectId(req.params.id)})
    if(deletedUser.deletedCount === 1){
        res.sendStatus(204)

    } else {
        res.sendStatus(404)
    }

}

export async function findUserById(req: Request, res:Response) {
    const user = await findUserByIdDB(req.params.id)
    if(user) {
        return mongoUserSlicing(user)
    } else {
        return false
    }
}