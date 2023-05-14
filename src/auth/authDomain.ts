import {Request, Response} from "express";
import {
    accessTokenSpoilness,
    addOldTokensAsProhibitedDB,
    LoginDB,
    refreshTokenSpoilness
} from "./authRepositoryMongoDB";
import {jwtService} from "../jwtDomain";
import {usersCollectionOutput} from "../users/usersDomain";
import {ObjectId} from "mongodb";
import {emailAdapter} from "./emailAdapter";
import {
    checkingForUserConfirmationStatus,
    checkUserExistance, checkUserExistanceByEmail,
    codeVerification,
    confirmUserStatus,
    createUnconfirmedUser, updateCodeOfUserConfirmation
} from "../users/usersRepositoryMongoDB";
import {v4 as uuidv4} from 'uuid'
import {saveDeviceToDB} from "../securityDevices/securityDevicesRepositoryDB";
import {createNewDevice} from "../securityDevices/securityDevicesDomain";
import jwt from "jsonwebtoken";
import {mongoObjectId} from "../common";



export async function Login(req: Request, res: Response) {
    const loginOrEmail = req.body.loginOrEmail
    const password = req.body.password

    const result = await LoginDB(loginOrEmail, password)
    if (result) {
        try {
            // deviceId
            const dateOfCreation = new Date().toISOString()
            const deviceId = mongoObjectId()
            const accessJWT = await jwtService.createAccessJWT(result, dateOfCreation, deviceId)
            const refreshJWT = await jwtService.createRefreshJWT(result, dateOfCreation, deviceId) //deviceId

            const payload: any = jwt.decode(refreshJWT)
            const lastActiveDate = new Date(payload.iat * 1000).toISOString()

            // const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress
            const ip = req.ip
            const title =  req.headers["user-agent"] || 'Default UA'
            const userId = result._id

            const newDevice = {
                ip : ip!.toString(),
                title : title!,
                lastActiveDate : dateOfCreation
            }
            const newSession =  await createNewDevice(newDevice, refreshJWT, userId)

            res.cookie('refreshToken', refreshJWT, { httpOnly: true, secure: true })
            res.status(200).send({
                accessToken: accessJWT
            })
            return
        } catch (e) {
            console.log(e)
        }

    } else {
        console.log("no result found")
        res.sendStatus(401)
    }
}
export async function Logout(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken
    if(!await jwtService.JWTverify(refreshToken) || await refreshTokenSpoilness(refreshToken)){
        res.sendStatus(401)
    } else {
        await addOldTokensAsProhibitedDB("refresh", refreshToken)
        res.sendStatus(204)
    }
}


export async function giveUserInformation(req: Request, res: Response) {
    const auth = req.headers.authorization
    if (auth !== undefined) {
        const userId = await jwtService.getUserIdByToken(auth.split(" ")[1])


        if(!userId){
            res.status(401).send(auth.split(" ")[1])
            return
        }
        const userInfo = await usersCollectionOutput.findOne({_id: new ObjectId(userId!)})
        res.status(200).send({
            "email": userInfo?.accountData.email,
            "login": userInfo?.accountData.login,
            "userId": userId
        })
        return
    } else {
        res.sendStatus(401)
        return
    }
}

export async function sendMessageToEmail(req: Request, res: Response) {
    const login = req.body.login
    const password = req.body.password
    const email = req.body.email

    const userExists = await checkUserExistance(login, password, email)
    if (userExists) {
        res.status(400).send(userExists)
    } else {
        const user = await createUnconfirmedUser(login, password, email)
        if (user) {
            //const info = await emailAdapter.sendEmail(req.body.email, user.accountConfirmationData.code)
            res.status(201).send({code :user.accountConfirmationData.code})
        } else {
            res.sendStatus(400)
        }
    }
}

export async function registrationConfirmation(req: Request, res: Response) {
    const code: string = req.body.code
    const codeVerificationResult = await codeVerification(code.toString())
    if (!codeVerificationResult) {
        res.status(400).send({errorsMessages: [{"message": "wrong code passed228", "field": "code"}]})
    } else {
        if (await confirmUserStatus(code.toString())) {
            res.sendStatus(204)
            return
        }
        res.status(400).send({errorsMessages: [{"message": "no code in query params passed", "field": "code"}]})
        return
    }
}

export async function registrationEmailResending(req: Request, res: Response) {
    const email = req.body.email
    const userExists = await checkUserExistanceByEmail(email)
    if (!userExists) {
        res.status(400).send({
            "errorsMessages": [{
                "message": "user with such email doesnt exists",
                "field": "email"
            }]
        })
    } else {
        if (await checkingForUserConfirmationStatus(email)) {
            res.status(400).send({
                "errorsMessages": [{
                    "message": "user already confirmed",
                    "field": "email"
                }]
            })
            return
        }


        const code = await createEmailSendCode()
        await updateCodeOfUserConfirmation(email, code)
        await emailAdapter.sendEmail(req.body.email, code)
        res.sendStatus(204)
    }
}

export async function refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken

    const userId = await jwtService.getUserIdByToken(refreshToken)
    if(!userId){
        res.sendStatus(401)
        return
    }
    const user = await usersCollectionOutput.findOne({_id : new ObjectId(userId)})
    const tokensVerification = !jwtService.JWTverify(refreshToken)
        || !user
        || await refreshTokenSpoilness(refreshToken)

    if(tokensVerification){
        res.sendStatus(401)
        return
    } else {
        const dateOfCreating = new Date().toISOString()
        const deviceId = mongoObjectId()
        const newRefreshToken = await jwtService.createRefreshJWT(user, dateOfCreating, deviceId)
        const newAccessToken = await jwtService.createAccessJWT(user, dateOfCreating, deviceId)
        await addOldTokensAsProhibitedDB("refresh", refreshToken)

        res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true,})
        res.send({"accessToken": newAccessToken}).status(200)

    }







}


    export async function createEmailSendCode() {
    return uuidv4()
}
