import {Request, Response} from "express";
import {randomUUID} from "crypto";
import {DeviceInputModel, DeviceViewModel} from "../appTypes";
import {getAllDevicesForSpecifiedUserDB, saveDeviceToDB} from "./securityDevicesRepositoryDB";
import {jwtService} from "../jwtDomain";
import {ObjectId} from "mongodb";

export async function getAllDevicesForSpecifiedUser(req: Request, res : Response) {
    const userId = await jwtService.getUserIdByToken(req.cookies.refreshToken)
    const devices = await getAllDevicesForSpecifiedUserDB(userId!)
    res.send(devices).status(201)
}
export async function deleteAllDevicesExcludeCurrent(req: Request, res : Response) {
    res.sendStatus(210)
}
export async function deleteDeviceByDeviceId(req: Request, res : Response) {
    res.sendStatus(210)
}
export async function createNewDevice(newDevice : DeviceInputModel, refreshToken : string , userId : ObjectId) {

    await saveDeviceToDB(newDevice, refreshToken, userId)
}