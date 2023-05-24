import {Request, Response} from "express";
import {ObjectId} from "mongodb";

import {v4 as uuidv4} from 'uuid'
import jwt from "jsonwebtoken";
import {addHours} from "date-fns";
import {usersModel} from "../mongo/mongooseSchemas";
import {randomUUID} from "crypto";
import {jwtService} from "../composition-root";
import {AuthRepository} from "./authRepositoryMongoDB";
import {SecurityDevicesRepository} from "../securityDevices/securityDevicesRepositoryDB";
import {SecurityDevicesController} from "../securityDevices/securityDevicesController";
import {UsersRepository} from "../users/usersRepositoryMongoDB";
import {EmailAdapter} from "./emailAdapter";
import {Common} from "../common";


export class AuthController {
    constructor(protected authRepository : AuthRepository,
                protected securityDevicesRepository : SecurityDevicesRepository,
                protected securityDevicesController : SecurityDevicesController,
                protected usersRepository : UsersRepository,
                protected emailAdapter : EmailAdapter,
                protected common : Common
    ) {

    }
    async Login(req: Request, res: Response) {
        const loginOrEmail = req.body.loginOrEmail
        const password = req.body.password

        const result = await this.authRepository.LoginDB(loginOrEmail, password)
        if (result) {
            try {
                // deviceId
                const dateOfCreation = new Date().toISOString()
                const deviceId = randomUUID()
                const accessJWT = await jwtService.createAccessJWT(result, dateOfCreation, deviceId)
                const refreshJWT = await jwtService.createRefreshJWT(result, dateOfCreation, deviceId) //deviceId

                const payload: any = jwt.decode(refreshJWT)

                const ip = req.ip
                const title = req.headers["user-agent"] || 'Default UA'
                const userId = result._id

                const newDevice = {
                    ip: ip!.toString(),
                    title: title!,
                    lastActiveDate: dateOfCreation
                }
                const newSession = await this.securityDevicesController.createNewDevice(newDevice, refreshJWT, userId)

                res.cookie('refreshToken', refreshJWT, {httpOnly: true, secure: true})
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
    async Logout(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        if (!await jwtService.JWTverify(refreshToken)) {
            res.sendStatus(401)
        } else {
            const payload: any = jwt.decode(refreshToken!)
            await this.securityDevicesRepository.deleteDeviceByIdDB(payload.deviceId)
            res.sendStatus(204)
        }
    }

    async giveUserInformation(req: Request, res: Response) {
        const auth = req.headers.authorization
        if (auth !== undefined) {
            const userId = await jwtService.getUserIdByToken(auth.split(" ")[1])


            if (!userId) {
                res.status(401).send(auth.split(" ")[1])
                return
            }
            const userInfo = await usersModel.findOne({_id: new ObjectId(userId!)})
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

    async sendMessageToEmail(req: Request, res: Response) {
        const login = req.body.login
        const password = req.body.password
        const email = req.body.email

        const userExists = await this.usersRepository.checkUserExistance(login, password, email)
        if (userExists) {
            res.status(400).send(userExists)
        } else {
            const user = await this.usersRepository.createUnconfirmedUser(login, password, email)
            if (user) {
                const info = await this.emailAdapter.sendEmail(req.body.email, user.accountConfirmationData.code)
                res.status(204).send({code: user.accountConfirmationData.code})
            } else {
                res.sendStatus(400)
            }
        }
    }

    async registrationConfirmation(req: Request, res: Response) {
        const code: string = req.body.code
        const codeVerificationResult = await this.usersRepository.codeVerification(code.toString())
        if (!codeVerificationResult) {
            res.status(400).send({errorsMessages: [{"message": "wrong code passed228", "field": "code"}]})
        } else {
            if (await this.usersRepository.confirmUserStatus(code.toString())) {
                res.sendStatus(204)
                return
            }
            res.status(400).send({errorsMessages: [{"message": "no code in query params passed", "field": "code"}]})
            return
        }
    }

    async registrationEmailResending(req: Request, res: Response) {
        const email = req.body.email
        const userExists = await this.usersRepository.checkUserExistanceByEmail(email)
        if (!userExists) {
            res.status(400).send({
                "errorsMessages": [{
                    "message": "user with such email doesnt exists",
                    "field": "email"
                }]
            })
        } else {
            if (await this.usersRepository.checkingForUserConfirmationStatus(email)) {
                res.status(400).send({
                    "errorsMessages": [{
                        "message": "user already confirmed",
                        "field": "email"
                    }]
                })
                return
            }


            const code = await this.common.createEmailSendCode()
            await this.usersRepository.updateCodeOfUserConfirmation(email, code)
            await this.emailAdapter.sendEmail(req.body.email, code)
            res.sendStatus(204)
        }
    }

    async passwordRecovery(req: Request, res: Response) { // ask question
        const email = req.body.email
        const userExists = await this.usersRepository.checkUserExistanceByEmail(email)
        const code = await this.common.createEmailSendCode()
        const dateOfExpiary = addHours(new Date, 12)
        if (!userExists) {
            await this.emailAdapter.sendEmailForPasswordRecovery(req.body.email, code)
            res.sendStatus(204)
        } else {
            await this.usersRepository.updateUserAsUnconfirmed(email, code, dateOfExpiary)
            await this.usersRepository.updateCodeOfUserConfirmation(email, code)
            await this.emailAdapter.sendEmailForPasswordRecovery(email, code)
            res.sendStatus(204)
        }


    }

    async newPassword(req: Request, res: Response) { // ask question
        const newPassword = req.body.newPassword
        const recoveryCode = req.body.recoveryCode
        const user = await this.usersRepository.findUserByCode(recoveryCode)

        if (!user) {
            res.status(400).send({errorsMessages: [{message: "no user found", field: "recoveryCode"}]})
            return
        } else if (user.accountConfirmationData.codeDateOfExpiary! < new Date() || recoveryCode !== user.accountConfirmationData.code!) {
            res.status(400).send({errorsMessages: [{message: "code is invalid", field: "recoveryCode"}]})
            return
        }


        const code = await this.common.createEmailSendCode()

        await this.usersRepository.confirmUserStatus(code.toString())
        await this.usersRepository.updateUserPasswordByEmail(user?.accountData.email, newPassword)
        res.sendStatus(204)

    }

    async refreshToken(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken

        const userId = await jwtService.getUserIdByToken(refreshToken)
        if (!userId) {
            res.sendStatus(401)
            return
        }
        const user = await usersModel.findOne({_id: new ObjectId(userId)})
        const tokensVerification = !jwtService.JWTverify(refreshToken)
            || !user

        if (tokensVerification) {
            res.sendStatus(401)
            return
        } else {
            const dateOfCreating = new Date().toISOString()
            const payload: any = jwt.decode(refreshToken)
            const deviceId = payload.deviceId
            const newRefreshToken = await jwtService.createRefreshJWT(user, dateOfCreating, deviceId)
            const newAccessToken = await jwtService.createAccessJWT(user, dateOfCreating, deviceId)

            await this.securityDevicesRepository.updateDeviceByUserId(userId, dateOfCreating, newRefreshToken)


            res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true,})
            res.send({"accessToken": newAccessToken}).status(200)

        }


    }

}
