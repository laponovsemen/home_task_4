import {Router} from 'express'
import {deleteAllInformation} from "./testingRepositoryMongoDB";
import {getAllSecurityDevices} from "../securityDevices/securityDevicesDomain";

export const testingRouter = Router({})


testingRouter.delete("", deleteAllInformation)
testingRouter.get("/all-security-devices", getAllSecurityDevices)