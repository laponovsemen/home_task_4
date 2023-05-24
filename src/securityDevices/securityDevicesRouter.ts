import {Router} from "express";
import {jwtService, securityDevicesController} from "../composition-root";




export const securityDevicesRouter = Router({})
// ask about req.baseUrl and counting requests

securityDevicesRouter.get("",
    jwtService.jwtVerificationMiddleware,
    securityDevicesController.getAllDevicesForSpecifiedUser)

securityDevicesRouter.delete("",
    jwtService.jwtVerificationMiddleware,
    securityDevicesController.deleteAllDevicesExcludeCurrent)

securityDevicesRouter.delete("/:deviceId",
    jwtService.jwtVerificationMiddleware,
    securityDevicesController.deleteDeviceByDeviceId)