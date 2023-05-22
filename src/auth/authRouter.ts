import {Router} from "express";
import {
    UserEmailValidation,
    UserLoginOrEmailValidation,
    UserLoginValidation, UserNewPasswordValidation,
    UserPasswordValidation
} from "../users/usersValidation";
import {ValidationErrors} from "../common";
import {
    giveUserInformation,
    Login, Logout, newPassword, passwordRecovery, refreshToken,
    registrationConfirmation,
    registrationEmailResending,
    sendMessageToEmail
} from "./authDomain";
import {requestsCounterMiddleware} from "../securityDevices/securityDevicesMiddleware";


export const authRouter = Router({})

authRouter.post("/login",requestsCounterMiddleware, UserLoginOrEmailValidation, UserPasswordValidation, ValidationErrors, Login)
authRouter.post("/password-recovery",requestsCounterMiddleware,UserEmailValidation,  ValidationErrors, passwordRecovery)
authRouter.post("/new-password",requestsCounterMiddleware,UserNewPasswordValidation, ValidationErrors,  newPassword)
authRouter.post("/refresh-token",refreshToken)
authRouter.post("/registration",requestsCounterMiddleware, UserEmailValidation,UserLoginValidation,  UserPasswordValidation, ValidationErrors, sendMessageToEmail)
authRouter.post("/registration-confirmation",requestsCounterMiddleware,  registrationConfirmation)
authRouter.post("/registration-email-resending",requestsCounterMiddleware, UserEmailValidation, ValidationErrors, registrationEmailResending)
authRouter.post("/logout",Logout)
authRouter.get("/me", giveUserInformation)

const SECRET_KEY = 'My-secret-key'
