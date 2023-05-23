import { commentsModel} from "../mongo/mongooseSchemas";


export async function deleteAllComments() {
    await commentsModel.deleteMany({})
}