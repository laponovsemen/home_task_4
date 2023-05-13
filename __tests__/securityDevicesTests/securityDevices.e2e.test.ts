// @ts-ignore
import request from "supertest";
import {app} from "../../src/settings";
import exp = require("constants");
const auth = 'Authorization'
const basic = 'Basic YWRtaW46cXdlcnR5'

describe(" ", () => {
    it(" ", async () => {
       await request(app).delete("/security/devices").expect(210)

    })




})