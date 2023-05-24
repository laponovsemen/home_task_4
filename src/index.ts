import {runDb} from "./mongo/db";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import {startRouter} from "./start/startRouter";
import {authRouter} from "./auth/authRouter";
import {postsRouter} from "./posts/postsRouter";
import {blogsRouter} from "./blogs/blogsRouter";
import {usersRouter} from "./users/usersRouter";
import {commentsRouter} from "./comments/commentsRouter";
import {testingRouter} from "./testing/testingRouter";
import {securityDevicesRouter} from "./securityDevices/securityDevicesRouter";
import {expressSettings} from "./settings";
dotenv.config()
export const app = express()
expressSettings(app)

const port = process.env.PORT || 8080
export const startApp =  async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`app started on ${port} port`)
    })
}
startApp()