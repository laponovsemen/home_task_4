import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import {userViewModel} from "./appTypes";
import {ObjectId} from "mongodb";
dotenv.config()

const secretKey = process.env.SECRET_KEY || "secret"


export const jwtService = {
    async  createJWT(user: userViewModel){
        const token: string = jwt.sign({userId : user._id, login: user.login, email : user.email}, secretKey, {expiresIn : "1h"})
        console.log(token)
        return token

    },
    async getUserIdByToken(token: string | undefined) {
        // @ts-ignore
        const result : any = jwt.verify(token, secretKey)
        return new ObjectId(result.userId)
    }
}
