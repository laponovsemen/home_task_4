import {app} from "./settings";
import {runDb} from "./db";

const port = process.env.PORT || 8080
app.set('trust proxy', true)
export const startApp =  async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`app started on ${port} port`)
    })
}
startApp()