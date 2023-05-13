// @ts-ignore
import request from "supertest";
import {app} from "../../src/settings";
import exp = require("constants");
import {ObjectId} from "mongodb";

const auth = 'Authorization'
const basic = 'Basic YWRtaW46cXdlcnR5'

describe("123", () => {
    jest.setTimeout(15000)
    it("321", async () => {
        const res0 = await request(app).delete("/security/devices")
        const res1 = await request(app).delete(`/security/devices/${new ObjectId()}`)
        const res2 = await request(app).get("/security/devices")
        expect(res0).toBeDefined()
        expect(res0.status).toBe(210)
        expect(res1).toBeDefined()
        expect(res1.status).toBe(404)
        expect(res2).toBeDefined()
        expect(res2.status).toBe(200)

    })


})