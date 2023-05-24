
import { DeviceInputModel} from "../appTypes";
import {ObjectId} from "mongodb";
import jwt from "jsonwebtoken";
import {subMinutes, subSeconds} from "date-fns";
import {requestsModel, sessionModel} from "../mongo/mongooseSchemas";



export async function saveDeviceToDB(deviceToSave: DeviceInputModel, refreshToken: string, userId: ObjectId) {
    const ip = deviceToSave.ip
    const title = deviceToSave.title
    const lastActiveDate = deviceToSave.lastActiveDate
    const payload: any = jwt.decode(refreshToken)
    const deviceId :string = payload.deviceId

    const device = {
        ip: ip,
        title: title,
        lastActiveDate: lastActiveDate,
        deviceId: deviceId
    }
    await sessionModel.insertMany([{
        userId: userId,
        device: device,
        refreshToken: refreshToken,
    }])
}

export async function getAllDevicesForSpecifiedUserDB(userId: ObjectId) {
    return await sessionModel.find({userId: userId})
}

export async function findDeviceById(deviceId: string) {
    const device = await sessionModel.findOne({"device.deviceId": new ObjectId(deviceId)})
    const devices = await sessionModel.find()
    //console.log({device: device!.deviceId, devices})
    return device
}

export async function deleteDeviceByIdDB(deviceId: string) {
    return await sessionModel.deleteOne({"device.deviceId": new ObjectId(deviceId)})
}
export async function deleteAllDevices() {
    await sessionModel.deleteMany({})
}

export async function findSessionsFromDB(userId: string, deviceId: string) {
    return await sessionModel.findOne({$and: [{userId: new ObjectId(userId)}, {'device.deviceId': new ObjectId(deviceId)}]})
}
export async function getAllSecurityDevicesDB() {
    return await sessionModel.find({})
}

export async function updateDeviceByUserId(userId: ObjectId, dateOfCreating: string, newRefreshToken: string) {
    return await sessionModel.updateOne({userId: userId}, {
        $set: {
            refreshToken: newRefreshToken,
            "device.lastActiveDate": dateOfCreating
        }
    })
}

export async function deleteAllDevicesExcludeCurrentDB(userId: ObjectId, deviceId: ObjectId) {
    const filter = {$and: [{userId : userId}, {'device.deviceId': {$ne: deviceId}}]}
    //const filter = {'device.deviceId': {$ne: deviceId}}
    return await sessionModel.deleteMany(filter)
}

export async function createNewRequestDB(ip: string, device: string, baseUrl: string) {
    const result = await requestsModel.collection.insertOne({
        ip,
        device: device,
        lastActiveDate: new Date(),
        baseUrl: baseUrl
    });

    return result
}

export async function readLastRequests(ip: string, device: string, baseUrl: string) {
    const date = new Date().toISOString()
    return requestsModel.find({
        $and:
            [
                {ip: ip},
                {device: device},
                {baseUrl: baseUrl},
                {lastActiveDate: {$gt: subSeconds(new Date(date), 10)}}
            ]
    });
}
