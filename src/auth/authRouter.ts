import {Router} from "express";
import {UserLoginOrEmailValidation, UserPasswordValidation} from "../users/usersValidation";
import {ValidationErrors} from "../common";
import {giveUserInformation, Login, registrationConfirmation, sendMessageToEmail} from "./authDomain";


export const authRouter = Router({})

authRouter.post("/login",UserLoginOrEmailValidation, UserPasswordValidation, ValidationErrors, Login)
authRouter.post("/registration", sendMessageToEmail)
authRouter.post("/registration-confirmation", registrationConfirmation)
authRouter.post("/registration-email-resending",UserLoginOrEmailValidation, UserPasswordValidation, ValidationErrors, Login)
authRouter.get("/me", giveUserInformation)

const SECRET_KEY = 'My-secret-key'
