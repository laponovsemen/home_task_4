import {Router} from "express";
import {UserEmailValidation, UserLoginValidation, UserPasswordValidation} from "./usersValidation";
import {apiMiddleware, usersController} from "../composition-root";
import {APIMiddleware} from "../common";


export const usersRouter = Router({})

usersRouter.get("",
    usersController.getAllUsers.bind(usersController))

usersRouter.post("",
    apiMiddleware.basicAuthGuardMiddleware.bind(apiMiddleware),
    UserLoginValidation,
    UserEmailValidation,
    UserPasswordValidation,
    apiMiddleware.ValidationErrors.bind(apiMiddleware),
    usersController.createUser.bind(usersController))

usersRouter.delete("/:id",
    apiMiddleware.basicAuthGuardMiddleware.bind(apiMiddleware),
    usersController.deleteUserById.bind(usersController))