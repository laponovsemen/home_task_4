import {Router} from "express";
import {createUser, deleteUserById, getAllUsers} from "./usersDomain";
import {basicAuthGuardMiddleware, ValidationErrors} from "../common";
import {UserEmailValidation, UserLoginValidation, UserPasswordValidation} from "./usersValidation";

export const usersRouter = Router({})

usersRouter.get("", getAllUsers)
usersRouter.post("", basicAuthGuardMiddleware, UserLoginValidation,UserEmailValidation, ValidationErrors, createUser)
usersRouter.delete("/:id", basicAuthGuardMiddleware, deleteUserById)