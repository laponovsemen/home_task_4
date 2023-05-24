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
    authController.Login.bind(authController))

authRouter.post("/password-recovery",
    securityDevicesMiddleware.requestsCounterMiddleware,
    UserEmailValidation,
    apiMiddleware.ValidationErrors,
    authController.passwordRecovery.bind(authController))

authRouter.post("/new-password",
    securityDevicesMiddleware.requestsCounterMiddleware,
    UserNewPasswordValidation,
    apiMiddleware.ValidationErrors,
    authController.newPassword.bind(authController))

authRouter.post("/refresh-token",
    authController.refreshToken.bind(authController))

authRouter.post("/registration",
    securityDevicesMiddleware.requestsCounterMiddleware,
    UserEmailValidation,
    UserLoginValidation,
    UserPasswordValidation,
    apiMiddleware.ValidationErrors,
    authController.sendMessageToEmail.bind(authController))

authRouter.post("/registration-confirmation",
    securityDevicesMiddleware.requestsCounterMiddleware,
    authController.registrationConfirmation.bind(authController))

authRouter.post("/registration-email-resending",
    securityDevicesMiddleware.requestsCounterMiddleware,
    UserEmailValidation,
    apiMiddleware.ValidationErrors,
    authController.registrationEmailResending.bind(authController))

authRouter.post("/logout",
    authController.Logout.bind(authController))

authRouter.get("/me",
    authController.giveUserInformation.bind(authController))

const SECRET_KEY = 'My-secret-key'
