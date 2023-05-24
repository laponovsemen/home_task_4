import {NextFunction, Request, Response} from "express";
import {SecurityDevicesRepository} from "./securityDevicesRepositoryDB";
export class SecurityDevicesMiddleware {
    constructor(protected securityDevicesRepository : SecurityDevicesRepository) {
    }
    async requestsCounterMiddleware(req: Request, res: Response, next: NextFunction) {
        const ip = req.ip
        const device = req.headers["user-agent"]
        const path = req.path
        await this.securityDevicesRepository.createNewRequestDB(ip, device!, path)
        const result = await this.securityDevicesRepository.readLastRequests(ip, device!, path)
        if (result.length > 5) {
            res.sendStatus(429)
        } else {
            next()
        }
    }
}