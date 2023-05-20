import {Request, Response} from "express";
import {randomUUID} from "crypto";
import {DeviceInputModel, DeviceViewModel} from "../appTypes";
import {
    deleteAllDevicesExcludeCurrentDB,
    deleteDeviceByIdDB,
    findDeviceById,
    findSessionsFromDB,
    getAllDevicesForSpecifiedUserDB,
    saveDeviceToDB
} from "./securityDevicesRepositoryDB";
import {jwtService} from "../jwtDomain";
import {ObjectId} from "mongodb";
import jwt from "jsonwebtoken";

export async function getAllDevicesForSpecifiedUser(req: Request, res: Response) {
    try {
        //console.log("info " + req.cookies.refreshToken)
        const userId = await jwtService.getUserIdByToken(req.cookies.refreshToken)
        const devices = await getAllDevicesForSpecifiedUserDB(userId!)
        console.log("info " + userId)
        const result = devices.map(value => {
            return value.device
        })

        res.send(result).status(200)
    } catch (e) {
        res.sendStatus(400)
    }
}

export async function deleteAllDevicesExcludeCurrent(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken
    const refreshTokenPayload: any = jwt.decode(refreshToken)
    const deviceIdFromRefreshToken = refreshTokenPayload!.deviceId
    const userIdFromRefreshToken = refreshTokenPayload!.userId
    await deleteAllDevicesExcludeCurrentDB(userIdFromRefreshToken, deviceIdFromRefreshToken)
    res.sendStatus(204)
}

export async function deleteDeviceByDeviceId(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken
    const refreshTokenPayload: any = jwt.decode(refreshToken)
    const userIdFromRefresToken = refreshTokenPayload!.userId
    const deviceIdFromParam : string = req.params.deviceId
    console.log({deviceIdFromParam})
    const foundDevice = await findDeviceById(deviceIdFromParam)

    if (!foundDevice) {
        console.log('404')
        return res.sendStatus(461)
    }

    if (!foundDevice.userId.equals(userIdFromRefresToken)) {
        console.log('403')
        return res.sendStatus(403)
    }
    console.log('204')
    await deleteDeviceByIdDB(deviceIdFromParam)
    return res.sendStatus(204)

}

export async function createNewDevice(newDevice: DeviceInputModel, refreshToken: string, userId: ObjectId) {

    await saveDeviceToDB(newDevice, refreshToken, userId)
}