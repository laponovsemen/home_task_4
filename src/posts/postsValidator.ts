import {body, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {ValidationErrors} from "../common";

const reg = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/

export const PostTitleValidation = body("title")
    .exists()
    .withMessage(" no title field in body ")
    .isString()
    .withMessage("the field title is not a sting")
    .bail()
    .trim()
    .isLength({min : 1, max : 30})
    .withMessage("the length of title field is more than 30 chars")

export const PostShortDescriptionValidation = body("shortDescription")
    .isString()
    .withMessage("the field shortDescription is not a sting")
    .bail()
    .trim()
    .isLength({min : 1, max : 100})
    .withMessage("the length of shortDescription field is more than 100 chars")

export const PostContentValidation = body("content")
    .isString()
    .withMessage("the field content is not a sting")
    .bail()
    .trim()
    .isLength({max : 1000})
    .withMessage("the length of content field is more than 1000 chars")
    .isLength({min : 1})
    .withMessage("the length of content field is empty string")

export const PostBlogIdValidation = body("blogId")
    .isString()
    .withMessage("the field blogId is not a sting")
    .trim()
    .isLength({min : 1})
    .withMessage("the blogId field is empty")




