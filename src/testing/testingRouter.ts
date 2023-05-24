import {Router} from 'express'
import {securityDevicesController, testingRepository} from "../composition-root";

export const testingRouter = Router({})


testingRouter.delete("", testingRepository.deleteAllInformation.bind(testingRepository))
testingRouter.get("/all-security-devices", securityDevicesController.getAllSecurityDevices.bind(testingRepository))