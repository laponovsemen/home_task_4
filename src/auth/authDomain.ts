import {Request, Response} from "express";
import {LoginDB} from "./authRepositoryMongoDB";

export async function Login(req: Request, res : Response) {
    const loginOrEmail = req.body.loginOrEmail
    const password =  req.body.password

    const result = await LoginDB(loginOrEmail, password)
    if(result){
        res.sendStatus(204)
    } else{
        res.sendStatus(401)
    }
}