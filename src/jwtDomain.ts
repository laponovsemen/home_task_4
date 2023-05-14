import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import {userViewModel} from "./appTypes";
import {ObjectId} from "mongodb";
dotenv.config()

const secretKey = process.env.SECRET_KEY


export const jwtService = {
    async  createAccessJWT(user: userViewModel, dateOfCreation : string){
        const token: string = jwt.sign({userId : user._id, login: user.accountData.login, email : user.accountData.email, dateOfCreation : dateOfCreation}, secretKey!, {expiresIn : "30m"})
        //console.log(token)
        return token
    },
    async  createRefreshJWT(user: userViewModel, dateOfCreation : string){
        const token: string = jwt.sign({userId : user._id, login: user.accountData.login, email : user.accountData.email, dateOfCreation : dateOfCreation}, secretKey!, {expiresIn : "2h"})
        //console.log(token)
        return token
    },
    async getUserIdByToken(token: string) {

        try {
            const result: any = jwt.verify(token, secretKey!)
            //console.log("Object id " + new ObjectId(result.userId))
            //console.log("   result" + result.toString() )
            return new ObjectId(result.userId)
        }catch(e){
            console.log(e + " error")
            return null
        }
    },

    async JWTverify (token:string) {
        try {
            const result: any = jwt.verify(token, secretKey!)
            return result
        }catch(e){
            console.log(e + " error")
            return null
        }
    }
}
