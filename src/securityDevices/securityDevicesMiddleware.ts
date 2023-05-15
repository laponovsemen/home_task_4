import {NextFunction, Request, Response} from "express";
import {createNewRequestDB, readLastRequests} from "./securityDevicesRepositoryDB";

export async function requestsCounterMiddleware(req: Request, res : Response, next : NextFunction) {
    const ip = req.ip
    const device = req.headers["user-agent"]
    await createNewRequestDB(ip, device!)
    const result = await readLastRequests(ip, device!)
    if(result.length > 5){
        res.sendStatus(429)
    } else {
        next()
    }
}