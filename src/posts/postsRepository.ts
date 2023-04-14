import {BlogViewModelType, PostViewModelType} from "../appTypes";
import {NextFunction, Request, Response} from "express";
/*


export let posts : PostViewModelType[] = []
export function getPostById(req: Request, res: Response) {
    const foundPost = posts.find(post => post.id === req.params.id)
    if(foundPost){
        res.status(200).send(foundPost)
    } else {
        res.sendStatus(404)
    }
}
export function getAllPosts(req: Request, res: Response) {
    res.status(200).send(posts)
}

export function deletePostById(req: Request, res: Response) {
    const foundBlog = posts.find(blog => blog.id === req.params.id)
    if(foundBlog){
        posts = posts.filter(blog => blog.id !== req.params.id)
        res.status(204)
    } else {
        res.sendStatus(404)
    }
}

export function deleteAllPosts() {
    posts = posts.splice(0, posts.length - 1)
}

export function  createPost() {

}
export function  updatePost() {

}
*/