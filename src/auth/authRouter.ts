import {Router} from "express";
import {
    UserEmailValidation,
    UserLoginOrEmailValidation,
    UserLoginValidation,
    UserPasswordValidation
} from "../users/usersValidation";
import {ValidationErrors} from "../common";
import {
    giveUserInformation,
    Login, refreshToken,
    registrationConfirmation,
    registrationEmailResending,
    sendMessageToEmail
} from "./authDomain";


export const authRouter = Router({})

authRouter.post("/login",UserLoginOrEmailValidation, UserPasswordValidation, ValidationErrors, Login)
authRouter.post("/refresh-token",refreshToken)

authRouter.post("/registration",UserEmailValidation,UserLoginValidation,  UserPasswordValidation, ValidationErrors, sendMessageToEmail)
authRouter.post("/registration-confirmation", registrationConfirmation)
authRouter.post("/registration-email-resending",UserEmailValidation, ValidationErrors, registrationEmailResending)
authRouter.post("/logout",UserLoginOrEmailValidation, UserPasswordValidation, ValidationErrors, Login)
authRouter.get("/me", giveUserInformation)

const SECRET_KEY = 'My-secret-key'
