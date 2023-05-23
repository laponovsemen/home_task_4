import request from "supertest";
import exp = require("constants");
import {ObjectId} from "mongodb";
import {cookie} from "express-validator";

import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {app} from "../../settings";
import {mongoObjectId} from "../../common";

dotenv.config()
const mongoURI = process.env.MONGO_URL!

const auth = 'Authorization'
const basic = 'Basic YWRtaW46cXdlcnR5'

describe("TEST OF CHECKING CONNECTED DEVICES", () => {
    beforeAll(async () => {
        /* Connecting to the database. */
        await mongoose.connect(mongoURI)
    })

    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close()
    })
    jest.setTimeout(30000)
    it("creating user, login 4 times and check devices", async () => {
        await request(app).delete("/testing/all-data")
        const registration = await request(app)
            .post("/auth/registration")
            .send({
                login: "login",
                email : "igorlaponov01011972@gmail.com",
                password : "password"
            }).expect(204)
        expect(registration.body.code).toEqual(expect.any(String))
        const registrationCode = registration.body.code


        const registrationConfirmation = await request(app)
            .post("/auth/registration-confirmation")
            .send({
                code : registrationCode
            }).expect(204)


        const login = await request(app)
            .post("/auth/login")
            .set('user-agent', 'FIREFOX')
            .send({
                loginOrEmail : "login",
                password : "password"
            }).expect(200)

        await request(app)
            .post("/auth/login")
            .set('user-agent', 'CHROME')
            .send({
                loginOrEmail : "login",
                password : "password"
            }).expect(200)

        await request(app)
            .post("/auth/login")
            .set('user-agent', 'SAFARI')
            .send({
                loginOrEmail : "login",
                password : "password"
            }).expect(200)

        await request(app)
            .post("/auth/login")
            .send({
                loginOrEmail : "login",
                password : "password"
            }).expect(200)

        const accessToken = login.body.accessToken
        const refreshToken = login.headers['set-cookie'][0].split(";")[0].slice(13)
        console.log(accessToken)
        console.log("refresh - " + refreshToken)

        const gettingAllDevicesForSpecificUser = await request(app)
            .get("/security/devices")
            .set("Cookie", [`refreshToken=${refreshToken}`])
            .expect(200)
        expect(gettingAllDevicesForSpecificUser.body).toEqual([
            {"deviceId": "", "ip": "::ffff:127.0.0.1", "lastActiveDate": expect.any(String), "title": "FIREFOX"},
            {"deviceId": "expect.any(String)", "ip": "::ffff:127.0.0.1", "lastActiveDate": expect.any(String), "title": "CHROME"},
            {"deviceId": 'expect.any(String)', "ip": "::ffff:127.0.0.1", "lastActiveDate": expect.any(String), "title": "SAFARI"},
            {"deviceId": 'expect.any(String)', "ip": "::ffff:127.0.0.1", "lastActiveDate": expect.any(String), "title": "Default UA"}]
    )

    })
    it("creating user and check for deleting", async () => {
        await request(app).delete("/testing/all-data")
        const registration = await request(app)
            .post("/auth/registration")
            .send({
                login: "login",
                email : "igorlaponov01011972@gmail.com",
                password : "password"
            }).expect(204)
        expect(registration.body.code).toEqual(expect.any(String))
        const registrationCode = registration.body.code


        const registrationConfirmation = await request(app)
            .post("/auth/registration-confirmation")
            .send({
                code : registrationCode
            }).expect(204)


        const login = await request(app)
            .post("/auth/login")
            .send({
                loginOrEmail : "login",
                password : "password"
            }).expect(200)

        const accessToken = login.body.accessToken
        const refreshToken = login.headers['set-cookie'][0].split(";")[0].slice(13)
        const payload : any = jwt.decode(refreshToken)
        const deviceId = payload.deviceId
        //console.log(accessToken)


        const gettingAllDevicesForSpecificUser = await request(app)
            .get("/security/devices")
            .set("Cookie", [`refreshToken=${refreshToken}`])
            .expect(200)

        console.log("refresh - " + deviceId)
        console.log("body - ", gettingAllDevicesForSpecificUser.body)

        const deleteDeviceById = await request(app)
            .delete(`/security/devices/${deviceId}`)
            .set("Cookie", [`refreshToken=${refreshToken}`])
            .expect(204)
        await request(app)
            .delete(`/security/devices/${mongoObjectId()}`)
            .set("Cookie", [`refreshToken=${refreshToken}`])
            .expect(404)
        //expect(gettingAllDevicesForSpecificUser.body).toEqual({})

    })
    it("creating user and check for deleting all devices excluding current device", async () => {
        await request(app).delete("/testing/all-data")
        const registration = await request(app)
            .post("/auth/registration")
            .send({
                login: "login",
                email : "igorlaponov01011972@gmail.com",
                password : "password"
            }).expect(201)
        expect(registration.body.code).toEqual(expect.any(String))
        const registrationCode = registration.body.code


        const registrationConfirmation = await request(app)
            .post("/auth/registration-confirmation")
            .send({
                code : registrationCode
            }).expect(204)


        const login = await request(app)
            .post("/auth/login")
            .set('user-agent', 'FIREFOX')
            .send({
                loginOrEmail : "login",
                password : "password"
            }).expect(200)

        await request(app)
            .post("/auth/login")
            .set('user-agent', 'CHROME')
            .send({
                loginOrEmail : "login",
                password : "password"
            }).expect(200)

        await request(app)
            .post("/auth/login")
            .set('user-agent', 'SAFARI')
            .send({
                loginOrEmail : "login",
                password : "password"
            }).expect(200)

        await request(app)
            .post("/auth/login")
            .send({
                loginOrEmail : "login",
                password : "password"
            }).expect(200)

        const accessToken = login.body.accessToken
        const refreshToken = login.headers['set-cookie'][0].split(";")[0].slice(13)
        const payload : any = jwt.decode(refreshToken)
        const deviceId = payload.deviceId
        //console.log(accessToken)


        const gettingAllDevices = await request(app)
            .get("/testing/all-data/all-security-devices")
            .set("Cookie", [`refreshToken=${refreshToken}`])
            .expect(200)
        console.log(gettingAllDevices.body)

        //console.log("refresh - " + deviceId)
        //console.log("body - ", gettingAllDevicesForSpecificUser.body)


        //expect(gettingAllDevicesForSpecificUser.body).toEqual({})

    })

})