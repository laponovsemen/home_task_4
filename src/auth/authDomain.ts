import {Request, Response} from "express";
import {LoginDB} from "./authRepositoryMongoDB";
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

export async function Login(req: Request, res: Response) {
    const loginOrEmail = req.body.loginOrEmail
    const password = req.body.password

    const result = await LoginDB(loginOrEmail, password)
    if (result) {
        try {
            const accessJWT = await jwtService.createAccessJWT(result)
            const refreshJWT = await jwtService.createAccessJWT(result)

            res.cookie('refreshJWT', refreshJWT, {httpOnly: true,secure: true})
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


export async function giveUserInformation(req: Request, res: Response) {
    const auth = req.headers.authorization
    if (auth !== undefined) {
        const userId = await jwtService.getUserIdByToken(auth)
        const userInfo = await usersCollectionOutput.findOne({_id: new ObjectId(userId!)})
        res.status(200).send({
            "email": userInfo?.accountData.email,
            "login": userInfo?.accountData.login,
            "userId": userId
        })
    } else {
        res.sendStatus(401)
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
            await emailAdapter.sendEmail(req.body.email, user.accountConfirmationData.code)
            res.sendStatus(204)
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

export async function createEmailSendCode() {
    return uuidv4()
}
