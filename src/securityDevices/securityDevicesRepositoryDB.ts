import {client} from "../db";
import {DeviceInputModel, DeviceViewModel, SessionsInputModel, SessionsViewModel, userViewModel} from "../appTypes";
import {randomUUID} from "crypto";
import {ObjectId} from "mongodb";
import {refreshToken} from "../auth/authDomain";
import {mongoObjectId} from "../common";
import jwt from "jsonwebtoken";


const devicesCollectionOutput = client.db("forum").collection<SessionsViewModel>("securityDevices")
const devicesCollectionInsert = client.db("forum").collection<SessionsInputModel>("securityDevices")

export async function saveDeviceToDB(deviceToSave : DeviceInputModel, refreshToken : string, userId : ObjectId) {
    const ip = deviceToSave.ip
    const title = deviceToSave.title
    const lastActiveDate = deviceToSave.lastActiveDate
    const payload: any = jwt.decode(refreshToken)
    const deviceId = payload.deviceId

    const device = {
        ip : ip,
        title : title,
        lastActiveDate: lastActiveDate,
        deviceId : deviceId
    }
    await devicesCollectionInsert.insertOne({
        userId : userId,
        device : device,
        refreshToken : refreshToken,
    })
}
export async function getAllDevicesForSpecifiedUserDB(userId : ObjectId) {
    return await devicesCollectionOutput.find({userId : userId}).toArray()
}
export async function findDeviceById(deviceId : string) {
    return !!await devicesCollectionOutput.findOne({"device.deviceId" : new ObjectId(deviceId)})
}
export async function deleteDeviceById(deviceId : string) {
    return await devicesCollectionOutput.deleteOne({"device.deviceId" : new ObjectId(deviceId)})
}

export async function findSessionsFromDB(userId : string, deviceId : string) {
    return await devicesCollectionOutput.findOne({$and : [{userId: new ObjectId(userId)}, {"device.deviceId" : new ObjectId(deviceId)}]})
}