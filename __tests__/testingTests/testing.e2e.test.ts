// @ts-ignore
import request from "supertest"
import {app} from "../../src/settings";
import {before} from "node:test";
import {auth, basic} from "../postsTests/posts.e2e.test";
//TESTING ROUTE
describe("testing od deleting all data  ", () => {
    it("testing od deleting all data // correct authorization ", () => {
        request(app)
            .delete("/testing/all-data")
            .set(auth, basic)
            .expect(204)
    })

    it("testing od deleting all data // incorrect authorization // wrong Authorization field value", () => {
        request(app)
            .delete("/testing/all-data")
            .set(auth, "ksdjfl;skdfjlkds")
            .expect(401)
    })

    it("testing od deleting all data // incorrect authorization // no Authorization field in header", () => {
        request(app)
            .delete("/testing/all-data")
            .set("lkdhjflksdfhkldsjhf", basic)
            .expect(401)
    })
})
