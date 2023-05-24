import {body} from "express-validator";

const reg = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/

    export const BlogNameValidation = body("name")
    .isString()
    .withMessage("the field name is not a sting")
    .bail()
        .trim()
        .isLength({max : 15})
    .withMessage("the length of name field is more than 15 chars")
        .bail()
        .isLength({min : 1})
        .withMessage("the length of name field is less than 1 chars ")

export const BlogDescriptionValidation = body("description")
    .isString()
    .withMessage("the field description is not a sting")
    .bail()
    .trim()
    .isLength({ min: 1})
    .withMessage("the length of description field is less than 1")
    .isLength({max : 500})
    .withMessage("the length of description field is more than 500 chars")

export const BlogWebsiteUrlValidation = body("websiteUrl")
    .isString()
    .withMessage("the field websiteUrl is not a sting")
    .bail()
    .trim()
    .matches(reg)
    .withMessage("the websiteUrl field is not URL")
    .bail()
    .isLength({min: 1})
    .withMessage("the length of websiteUrl field is less than 1")
    .isLength({min: 1, max : 100})
    .withMessage("the length of websiteUrl field is more than 100 chars ")


