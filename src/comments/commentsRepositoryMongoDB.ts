import { commentsModel} from "../mongo/mongooseSchemas";

export class CommentsRepository {
    async deleteAllComments() {
        await commentsModel.deleteMany({})
    }
}