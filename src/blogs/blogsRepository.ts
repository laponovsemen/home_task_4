/*
import {BlogViewModelType} from "../appTypes";
import {NextFunction, Request, Response} from "express";
import {createNewBlogId} from "../common";


export let blogs : BlogViewModelType[] = []
export function getBlogById(req: Request, res: Response) {
    const foundBlog = blogs.find(blog => blog.id === req.params.id)
    if(foundBlog){
        res.status(200).send(foundBlog)
    } else {
        res.sendStatus(404)
    }
}
export function getAllBlogs(req: Request, res: Response) {
    res.status(200).send(blogs)
}

export function deleteBlogById(req: Request, res: Response) {
    const foundBlog = blogs.find(blog => blog.id === req.params.id)
    if(foundBlog){
        blogs = blogs.filter(blog => blog.id !== req.params.id)
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
}



export function createBlog(req: Request, res: Response) {
    const newBlog = {
        "id": createNewBlogId(blogs),
        "name": req.body.name,
        "description": req.body.description,
        "websiteUrl": req.body.websiteUrl,
        "createdAt": new Date().toISOString(),
        "isMembership": true // always true
    }
    blogs.push(newBlog)
    res.status(201).send(newBlog)
}

export function deleteAllBlogs() {
    blogs = blogs.splice(0, blogs.length - 1)

}

export function updateBlog(req: Request, res: Response) {
    const foundBlog = blogs.find(blog => blog.id === req.params.id)

    if(foundBlog){
        const index = blogs.indexOf(foundBlog)
        const updatedBlog = {
            "id": foundBlog.id,
            "name": req.body.name,
            "description": req.body.description,
            "websiteUrl": req.body.websiteUrl,
            "createdAt": foundBlog.createdAt,
            "isMembership": foundBlog.isMembership // always true
        }
        blogs[index] = updatedBlog
        res.sendStatus(204)

    } else {
        res.status(404)
    }



}



*/

