import {Router} from "express";
import {
    UserEmailValidation,
    UserLoginOrEmailValidation,
    UserLoginValidation, UserNewPasswordValidation,
    UserPasswordValidation
} from "../users/usersValidation";
import {apiMiddleware, authController, securityDevicesMiddleware} from "../composition-root";


export const authRouter = Router({})

authRouter.post("/login",
    securityDevicesMiddleware.requestsCounterMiddleware,
    UserLoginOrEmailValidation,
    UserPasswordValidation,
    apiMiddleware.ValidationErrors,
    authController.Login)

authRouter.post("/password-recovery",
    securityDevicesMiddleware.requestsCounterMiddleware,
    UserEmailValidation,
    apiMiddleware.ValidationErrors,
    authController.passwordRecovery)

authRouter.post("/new-password",
    securityDevicesMiddleware.requestsCounterMiddleware,
    UserNewPasswordValidation,
    apiMiddleware.ValidationErrors,
    authController.newPassword)

authRouter.post("/refresh-token",
    authController.refreshToken)

authRouter.post("/registration",
    securityDevicesMiddleware.requestsCounterMiddleware,
    UserEmailValidation,
    UserLoginValidation,
    UserPasswordValidation,
    apiMiddleware.ValidationErrors,
    authController.sendMessageToEmail)

authRouter.post("/registration-confirmation",
    securityDevicesMiddleware.requestsCounterMiddleware,
    authController.registrationConfirmation)

authRouter.post("/registration-email-resending",
    securityDevicesMiddleware.requestsCounterMiddleware,
    UserEmailValidation,
    apiMiddleware.ValidationErrors,
    authController.registrationEmailResending)

authRouter.post("/logout",
    authController.Logout)

authRouter.get("/me",
    authController.giveUserInformation)

const SECRET_KEY = 'My-secret-key'
