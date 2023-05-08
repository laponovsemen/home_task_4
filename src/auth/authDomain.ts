import {Request, Response} from "express";
import {LoginDB} from "./authRepositoryMongoDB";
import {jwtService} from "../jwtDomain";
import {usersCollectionOutput} from "../users/usersDomain";
import {ObjectId} from "mongodb";
import {emailAdapter} from "./emailAdapter";

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
    const auth = req.headers.authorization
    if(auth !== undefined) {
        const userId = await jwtService.getUserIdByToken(auth)
        const userInfo = await usersCollectionOutput.findOne({_id : new ObjectId(userId!)})
        res.status(200).send({
            "email": userInfo?.email,
            "login": userInfo?.login,
            "userId": userId
        })
    } else {
        res.sendStatus(401)
    }
}

export async function sendMessageToEmail(req: Request, res : Response) {
    await emailAdapter.sendEmail(req.body.email,req.body.subject,req.body.message)
    res.sendStatus(204)
}