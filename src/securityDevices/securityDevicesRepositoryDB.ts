import {client} from "../db";
import {
    DeviceInputModel,
    DeviceViewModel, RequestsInputModel,
    RequestsOutputModel,
    SessionsInputModel,
    SessionsViewModel,
    userViewModel
} from "../appTypes";
import {randomUUID} from "crypto";
import {ObjectId} from "mongodb";
import {refreshToken} from "../auth/authDomain";
import {mongoObjectId} from "../common";
import jwt from "jsonwebtoken";
import {subMinutes, subSeconds} from "date-fns";


const devicesCollectionOutput = client.db("forum").collection<SessionsViewModel>("securityDevices")
const devicesCollectionInsert = client.db("forum").collection<SessionsInputModel>("securityDevices")
const requestsCollectionInsert = client.db("forum").collection<RequestsInputModel>("Requests")
const requestsCollectionOutput = client.db("forum").collection<RequestsOutputModel>("Requests")

export async function saveDeviceToDB(deviceToSave: DeviceInputModel, refreshToken: string, userId: ObjectId) {
    const ip = deviceToSave.ip
    const title = deviceToSave.title
    const lastActiveDate = deviceToSave.lastActiveDate
    const payload: any = jwt.decode(refreshToken)
    const deviceId = payload.deviceId

    const device = {
        ip: ip,
        title: title,
        lastActiveDate: lastActiveDate,
        deviceId: new ObjectId(deviceId)
    }
    await devicesCollectionInsert.insertOne({
        userId: userId,
        device: device,
        refreshToken: refreshToken,
    })
}

export async function getAllDevicesForSpecifiedUserDB(userId: ObjectId) {
    return await devicesCollectionOutput.find({userId: userId}).toArray()
}

export async function findDeviceById(deviceId: string) {
    const device = await devicesCollectionOutput.findOne({"device.deviceId": new ObjectId(deviceId)})
    const devices = await devicesCollectionOutput.find().toArray()
    //console.log({device: device!.deviceId, devices})
    return device
}

export async function deleteDeviceByIdDB(deviceId: string) {
    return await devicesCollectionOutput.deleteOne({"device.deviceId": new ObjectId(deviceId)})
}
export async function deleteAllDevices() {
    return await devicesCollectionOutput.deleteMany({})
}

export async function findSessionsFromDB(userId: string, deviceId: string) {
    return await devicesCollectionOutput.findOne({$and: [{userId: new ObjectId(userId)}, {'device.deviceId': new ObjectId(deviceId)}]})
}

export async function updateDeviceByUserId(userId: ObjectId, dateOfCreating: string, newRefreshToken: string) {
    return await devicesCollectionInsert.updateOne({userId: userId}, {
        $set: {
            refreshToken: newRefreshToken,
            "device.lastActiveDate": dateOfCreating
        }
    })
}

export async function deleteAllDevicesExcludeCurrentDB(userId: ObjectId, deviceId: ObjectId) {
    const filter = {$and: [{userId}, {'device.deviceId': {$ne: deviceId}}]}
    return await devicesCollectionOutput.deleteMany(filter)
}

export async function createNewRequestDB(ip: string, device: string, baseUrl: string) {
    return await requestsCollectionInsert.insertOne({
        ip,
        device: device,
        lastActiveDate: new Date(),
        baseUrl: baseUrl
    })
}

export async function readLastRequests(ip: string, device: string, baseUrl: string) {
    const date = new Date().toISOString()
    return requestsCollectionOutput.find({
        $and:
            [
                {ip: ip},
                {device: device},
                {baseUrl: baseUrl},
                {lastActiveDate: {$gt: subSeconds(new Date(date), 10)}}
            ]
    }).toArray();
}
