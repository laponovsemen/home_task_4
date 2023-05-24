import {Router} from "express";
import {jwtService, securityDevicesController} from "../composition-root";




export const securityDevicesRouter = Router({})
// ask about req.baseUrl and counting requests

securityDevicesRouter.get("",
    jwtService.jwtVerificationMiddleware.bind(jwtService),
    securityDevicesController.getAllDevicesForSpecifiedUser.bind(securityDevicesController))

securityDevicesRouter.delete("",
    jwtService.jwtVerificationMiddleware.bind(jwtService),
    securityDevicesController.deleteAllDevicesExcludeCurrent.bind(securityDevicesController))

securityDevicesRouter.delete("/:deviceId",
    jwtService.jwtVerificationMiddleware.bind(jwtService),
    securityDevicesController.deleteDeviceByDeviceId.bind(securityDevicesController))