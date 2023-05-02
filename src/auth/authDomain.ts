import {Request, Response} from "express";
import {LoginDB} from "./authRepositoryMongoDB";
import {jwtService} from "../jwtDomain";
import {usersCollectionOutput} from "../users/usersDomain";
import {ObjectId} from "mongodb";

export async function Login(req: Request, res : Response) {
    const loginOrEmail = req.body.loginOrEmail
    const password =  req.body.password
    const result = await LoginDB(loginOrEmail, password)
    if(result){
        try {
            const JWT = await jwtService.createJWT(result)
            res.status(200).send({
                accessToken: JWT
            })
        }catch(e){
            console.log(e)
        }

    } else{
        res.sendStatus(401)
    }
}


export async function giveUserInformation(req: Request, res : Response) {
    const header = req.header("Authorization")
    if(header !== undefined) {
        const userId = await jwtService.getUserIdByToken(req.header("Authorization"))
        const userInfo = await usersCollectionOutput.findOne({_id : new ObjectId(userId)})
        res.status(200).send({
            "email": userInfo?.email,
            "login": userInfo?.login,
            "userId": userId
        })
    } else {
        res.sendStatus(401)
    }
}