import {Router} from 'express'
import {deleteAllInformation} from "./testingRepositoryMongoDB";

export const testingRouter = Router({})


testingRouter.delete("", deleteAllInformation)