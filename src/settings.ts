import express from 'express'
import {postsRouter} from "./posts/postsRouter";
import {blogsRouter} from "./blogs/blogsRouter";
import {startRouter} from "./start/startRouter";
import {testingRouter} from "./testing/testingRouter";

export const app = express()

app.use(express.json())

app.use("", startRouter)
app.use("/posts", postsRouter)
app.use("/blogs", blogsRouter)
app.use("/testing/all-data", testingRouter)