import {Router} from "express";
import {
    deleteAllDevicesExcludeCurrent,
    deleteDeviceByDeviceId,
    getAllDevicesForSpecifiedUser
} from "./securityDevicesDomain";
import {JWTVerifiction} from "./securityDevicesMiddleware";
import {jwtVerificationMiddleware} from "../jwtDomain";



export const securityDevicesRouter = Router({})
// ask about req.baseUrl and counting requests
securityDevicesRouter.get("",  getAllDevicesForSpecifiedUser)
securityDevicesRouter.delete("",jwtVerificationMiddleware,   deleteAllDevicesExcludeCurrent)
securityDevicesRouter.delete("/:deviceId", jwtVerificationMiddleware,  deleteDeviceByDeviceId)