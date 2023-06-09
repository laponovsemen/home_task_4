import {body} from "express-validator";
const loginRegExp = /^[a-zA-Z0-9_-]*$/
const emailRegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
export const UserLoginValidation = body("login")
    .isString()
    .withMessage("the field login is not a sting")
    .bail()
    .trim()
    .isLength({min : 3, max : 10})
    .withMessage("the length of login field must be not more than 10 and not less than 3 chars")
    .bail()
    .matches(loginRegExp)
    .withMessage("login is not in appropriate format")

export const UserPasswordValidation = body("password")
    .isString()
    .withMessage("the field password is not a sting")
    .bail()
    .trim()
    .isLength({min : 6, max : 20})
    .withMessage("the length of password field must be not more than 20 and not less than 6 chars")

export const UserNewPasswordValidation = body("newPassword")
    .isString()
    .withMessage("the field password is not a sting")
    .bail()
    .trim()
    .isLength({min : 6, max : 20})
    .withMessage("the length of password field must be not more than 20 and not less than 6 chars")
export const UserEmailValidation = body("email")
    .isString()
    .withMessage("the field email is not a sting")
    .bail()
    .trim()
    .matches(emailRegExp)
    .withMessage("email field is not email")

export const UserLoginOrEmailValidation = body("loginOrEmail")
    .isString()
    .withMessage("the field loginOrEmail is not a sting")
    .bail()
    .trim()
    .isLength({min : 3, max : 20})
    .withMessage("the length of password field must be not more than 20 and not less than 3 chars")