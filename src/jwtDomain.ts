import jwt from 'jsonwebtoken'
require('dotenv').config()
import {userViewModel} from "./appTypes";
import {ObjectId} from "mongodb";
import {NextFunction, Request, Response} from "express";


const secretKey = process.env.SECRET_KEY


export class JwtService {
    async createAccessJWT(user: userViewModel, dateOfCreation: string, deviceId: string) {
        const token: string = jwt.sign({
                userId: user._id,
                login: user.accountData.login,
                email: user.accountData.email,
                dateOfCreation: dateOfCreation,
                deviceId: deviceId
            },
            secretKey!,
            {expiresIn: "30m"})
        //console.log(token)
        return token
    }

    async createRefreshJWT(user: userViewModel, dateOfCreation: string, deviceId: string) {
        const token: string = jwt.sign({
                userId: user._id,
                login: user.accountData.login,
                email: user.accountData.email,
                dateOfCreation: dateOfCreation,
                deviceId: deviceId
            },
            secretKey!,
            {expiresIn: "2h"})
        //console.log(token)
        return token
    }

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, secretKey!)
            //console.log("Object id " + new ObjectId(result.userId))
            //console.log("   result" + result.toString() )
            return new ObjectId(result.userId)
        } catch (e) {
            console.log(e + " error")
            return null
        }
    }
    async getUserLoginByToken(token: string) {
        try {
            const result: any = jwt.verify(token, secretKey!)
            //console.log("Object id " + new ObjectId(result.userId))
            //console.log("   result" + result.toString() )
            return result.login
        } catch (e) {
            console.log(e + " error")
            return null
        }
    }

    async JWTverify(token: string) {
        try {
            const result: any = jwt.verify(token, secretKey!)
            return result
        } catch (e) {
            console.log(e + " error")
            return null
        }
    }

    async jwtVerificationMiddleware(req: Request, res: Response, next: NextFunction) {
        const userId = await this.getUserIdByToken(req.cookies.refreshToken)
        //const foundUser = await findUserByIdDB(userId!.toString())
        if (!userId) {
            res.sendStatus(401)
        } else {
            next()
        }
    }
}
