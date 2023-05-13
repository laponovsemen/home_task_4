import {client} from "../db";
import {DeviceInputModel, DeviceViewModel, SessionsInputModel, SessionsViewModel, userViewModel} from "../appTypes";
import {randomUUID} from "crypto";
import {ObjectId} from "mongodb";
import {refreshToken} from "../auth/authDomain";


const devicesCollectionOutput = client.db("forum").collection<SessionsViewModel>("securityDevices")
const devicesCollectionInsert = client.db("forum").collection<SessionsInputModel>("securityDevices")

export async function saveDeviceToDB(deviceToSave : DeviceInputModel, refreshToken : string, userId : ObjectId) {
    const ip = deviceToSave.ip
    const title = deviceToSave.title
    const lastActiveDate = deviceToSave.lastActiveDate
    const deviceId = randomUUID()

    const device = {
        ip : ip,
        title : title,
        lastActiveDate: lastActiveDate,
        deviceId : new ObjectId(deviceId)
    }
    await devicesCollectionInsert.insertOne({
        userId : userId,
        device : device,
        refreshToken : refreshToken,
    })
}
export async function getAllDevicesForSpecifiedUserDB(userId : ObjectId) {
    return await devicesCollectionOutput.find({userId : userId})
}
export async function findDevice(deviceId : string) {
    return !!await devicesCollectionOutput.findOne({"device.deviceId" : new ObjectId(deviceId)})
}