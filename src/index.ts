import {app} from "./settings";
import {runDb} from "./mongo/db";

const port = process.env.PORT || 8080
export const startApp =  async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`app started on ${port} port`)
    })
}
startApp()