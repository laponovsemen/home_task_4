import {usersCollectionOutput} from "../users/usersDomain";
import {commentsCollectionOutput} from "./commentsDomain";

export async function deleteAllComments() {
    await commentsCollectionOutput.deleteMany({})
}