import {Router} from "express";
import {UserLoginOrEmailValidation, UserPasswordValidation} from "../users/usersValidation";
import {ValidationErrors} from "../common";
import {Login} from "./authDomain";

export const authRouter = Router({})

authRouter.post("/login",UserLoginOrEmailValidation, UserPasswordValidation, ValidationErrors, Login)