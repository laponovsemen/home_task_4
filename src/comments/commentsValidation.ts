import {body} from "express-validator";

export const commentContentValidation = body("content")
    .isString()
    .withMessage("the field content is not a sting")
    .bail()
    .trim()
    .isLength({max : 300})
    .withMessage("the length of content field is more than 300 chars")
    .bail()
    .isLength({min : 20})
    .withMessage("the length of content field is less than 20 chars ")

export const commentsLikeStatusValidation = body("likeStatus")
    .isString()
    .withMessage("the field content is not a sting")
    .bail()
    .trim()
    .matches(/^Like$|^Dislike$|^None$/)
    .withMessage("wrong format of likesInfo status")

