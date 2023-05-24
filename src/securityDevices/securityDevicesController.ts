import {Request, Response} from "express";
import {randomUUID} from "crypto";
import {DeviceInputModel, DeviceViewModel} from "../appTypes";


import {ObjectId} from "mongodb";
import jwt from "jsonwebtoken";
import {JwtService} from "../jwtDomain";
import {SecurityDevicesRepository} from "./securityDevicesRepositoryDB";
export class SecurityDevicesController {
    constructor(protected jwtService : JwtService,
                protected securityDevicesRepository : SecurityDevicesRepository) {
    }

    async getAllDevicesForSpecifiedUser(req: Request, res: Response) {
        try {
            //console.log("info " + req.cookies.refreshToken)
            const userId = await this.jwtService.getUserIdByToken(req.cookies.refreshToken)

            const devices = await this.securityDevicesRepository.getAllDevicesForSpecifiedUserDB(new ObjectId(userId!))
            //console.log("info " + userId)
            const result = devices.map(value => {
                return value.device
            })

            res.status(200).send(result)
        } catch (e) {
            res.sendStatus(400)
        }
    }

    async getAllSecurityDevices(req: Request, res: Response) {
        const result = await this.securityDevicesRepository.getAllSecurityDevicesDB()
        res.status(200).send(result)
    }
    async deleteAllDevicesExcludeCurrent(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        const refreshTokenPayload: any = jwt.decode(refreshToken)
        const deviceIdFromRefreshToken = new ObjectId(refreshTokenPayload!.deviceId)
        const userIdFromRefreshToken = new ObjectId(refreshTokenPayload!.userId)
        await this.securityDevicesRepository.deleteAllDevicesExcludeCurrentDB(userIdFromRefreshToken, deviceIdFromRefreshToken)
        res.sendStatus(204)
    }

    async deleteDeviceByDeviceId(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        const refreshTokenPayload: any = jwt.decode(refreshToken)
        const userIdFromRefresToken = refreshTokenPayload!.userId
        const deviceIdFromParam: string = req.params.deviceId
        console.log({deviceIdFromParam})
        const foundDevice = await this.securityDevicesRepository.findDeviceById(deviceIdFromParam)

        if (!foundDevice) {
            console.log('404')
            return res.sendStatus(404)
        }

        if (!foundDevice.userId.equals(userIdFromRefresToken)) {
            console.log('403')
            return res.sendStatus(403)
        }
        console.log('204')
        await this.securityDevicesRepository.deleteDeviceByIdDB(deviceIdFromParam)
        return res.sendStatus(204)

    }

    async createNewDevice(newDevice: DeviceInputModel, refreshToken: string, userId: ObjectId) {

        await this.securityDevicesRepository.saveDeviceToDB(newDevice, refreshToken, userId)
    }
}