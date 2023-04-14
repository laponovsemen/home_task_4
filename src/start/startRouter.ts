import {Response, Request, Router} from 'express'

export const startRouter = Router({})

startRouter.get("", (req: Request, res: Response) => {
    res.status(200).send("API started working")
})