
import { DeviceInputModel} from "../appTypes";
import {ObjectId} from "mongodb";
import jwt from "jsonwebtoken";
import {subMinutes, subSeconds} from "date-fns";
import {requestsModel, sessionModel} from "../mongo/mongooseSchemas";


export class SecurityDevicesRepository {
    async saveDeviceToDB(deviceToSave: DeviceInputModel, refreshToken: string, userId: ObjectId) {
        const ip = deviceToSave.ip
        const title = deviceToSave.title
        const lastActiveDate = deviceToSave.lastActiveDate
        const payload: any = jwt.decode(refreshToken)
        const deviceId: string = payload.deviceId

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

    async getAllDevicesForSpecifiedUserDB(userId: ObjectId) {
        return  sessionModel.find({userId: userId})
    }

    async findDeviceById(deviceId: string) {
        const device = await sessionModel.findOne({"device.deviceId": new ObjectId(deviceId)})
        const devices = await sessionModel.find()
        //console.log({device: device!.deviceId, devices})
        return device
    }

    async deleteDeviceByIdDB(deviceId: string) {
        return  sessionModel.deleteOne({"device.deviceId": new ObjectId(deviceId)})
    }
    async deleteAllDevices() {
         await sessionModel.deleteMany({})
    }
    async findSessionsFromDB(userId: string, deviceId: string) {
        return  sessionModel.findOne({$and: [{userId: new ObjectId(userId)}, {'device.deviceId': new ObjectId(deviceId)}]})
    }

    async getAllSecurityDevicesDB() {
        return  sessionModel.find({})
    }
    async updateDeviceByUserId(userId: ObjectId, dateOfCreating: string, newRefreshToken: string) {
        return  sessionModel.updateOne({userId: userId}, {
            $set: {
                refreshToken: newRefreshToken,
                "device.lastActiveDate": dateOfCreating
            }
        })
    }
    async deleteAllDevicesExcludeCurrentDB(userId: ObjectId, deviceId: ObjectId) {
        const filter = {$and: [{userId: userId}, {'device.deviceId': {$ne: deviceId}}]}
        //const filter = {'device.deviceId': {$ne: deviceId}}
        return sessionModel.deleteMany(filter)
    }

    async createNewRequestDB(ip: string, device: string, baseUrl: string) {
        const result = await requestsModel.collection.insertOne({
            ip,
            device: device,
            lastActiveDate: new Date(),
            baseUrl: baseUrl
        });

        return result
    }
    async readLastRequests(ip: string, device: string, baseUrl: string) {
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
}
