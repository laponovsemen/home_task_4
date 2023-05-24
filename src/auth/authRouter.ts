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
    securityDevicesMiddleware.requestsCounterMiddleware.bind(securityDevicesMiddleware),
    UserLoginOrEmailValidation,
    UserPasswordValidation,
    apiMiddleware.ValidationErrors.bind(apiMiddleware),
    authController.Login.bind(authController))

authRouter.post("/password-recovery",
    securityDevicesMiddleware.requestsCounterMiddleware.bind(securityDevicesMiddleware),
    UserEmailValidation,
    apiMiddleware.ValidationErrors.bind(apiMiddleware),
    authController.passwordRecovery.bind(authController))

authRouter.post("/new-password",
    securityDevicesMiddleware.requestsCounterMiddleware.bind(securityDevicesMiddleware),
    UserNewPasswordValidation,
    apiMiddleware.ValidationErrors.bind(apiMiddleware),
    authController.newPassword.bind(authController))

authRouter.post("/refresh-token",
    authController.refreshToken.bind(authController))

authRouter.post("/registration",
    securityDevicesMiddleware.requestsCounterMiddleware.bind(securityDevicesMiddleware),
    UserEmailValidation,
    UserLoginValidation,
    UserPasswordValidation,
    apiMiddleware.ValidationErrors.bind(apiMiddleware),
    authController.sendMessageToEmail.bind(authController))

authRouter.post("/registration-confirmation",
    securityDevicesMiddleware.requestsCounterMiddleware.bind(securityDevicesMiddleware),
    authController.registrationConfirmation.bind(authController))

authRouter.post("/registration-email-resending",
    securityDevicesMiddleware.requestsCounterMiddleware.bind(securityDevicesMiddleware),
    UserEmailValidation,
    apiMiddleware.ValidationErrors.bind(apiMiddleware),
    authController.registrationEmailResending.bind(authController))

authRouter.post("/logout",
    authController.Logout.bind(authController))

authRouter.get("/me",
    authController.giveUserInformation.bind(authController))

const SECRET_KEY = 'My-secret-key'
