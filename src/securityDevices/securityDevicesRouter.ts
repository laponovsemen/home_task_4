import {Router} from "express";
import {
    deleteAllDevicesExcludeCurrent,
    deleteDeviceByDeviceId,
    getAllDevicesForSpecifiedUser
} from "./securityDevicesDomain";
import {JWTVerifiction} from "./securityDevicesMiddleware";



export const securityDevicesRouter = Router({})
// ask about req.baseUrl and counting requests
securityDevicesRouter.get("/",  getAllDevicesForSpecifiedUser)
securityDevicesRouter.delete("/",  deleteAllDevicesExcludeCurrent)
securityDevicesRouter.delete("/:deviceId",  deleteDeviceByDeviceId)