import express from 'express'
import {postsRouter} from "./posts/postsRouter";
import {blogsRouter} from "./blogs/blogsRouter";
import {startRouter} from "./start/startRouter";
import {testingRouter} from "./testing/testingRouter";
import {usersRouter} from "./users/usersRouter";
import {authRouter} from "./auth/authRouter";
import {commentsRouter} from "./comments/commentsRouter";
import cookieParser from "cookie-parser";
import {securityDevicesRouter} from "./securityDevices/securityDevicesRouter";

export const app = express()

app.use(express.json())
app.use(cookieParser())

app.use("", startRouter)
app.use("/auth", authRouter)
app.use("/posts", postsRouter)
app.use("/blogs", blogsRouter)
app.use("/users", usersRouter)
app.use("/comments", commentsRouter)
app.use("/testing/all-data", testingRouter)
app.use("/security/devices", securityDevicesRouter)