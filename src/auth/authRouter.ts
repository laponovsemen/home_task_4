import {Router} from "express";
import {UserLoginOrEmailValidation, UserPasswordValidation} from "../users/usersValidation";
import {ValidationErrors} from "../common";
import {giveUserInformation, Login} from "./authDomain";


export const authRouter = Router({})

authRouter.post("/login",UserLoginOrEmailValidation, UserPasswordValidation, ValidationErrors, Login)
authRouter.post("/registration",UserLoginOrEmailValidation, UserPasswordValidation, ValidationErrors, Login)
authRouter.post("/registration-confirmation",UserLoginOrEmailValidation, UserPasswordValidation, ValidationErrors, Login)
authRouter.post("/registration-email-resending",UserLoginOrEmailValidation, UserPasswordValidation, ValidationErrors, Login)
authRouter.get("/me", giveUserInformation)

const SECRET_KEY = 'My-secret-key'
