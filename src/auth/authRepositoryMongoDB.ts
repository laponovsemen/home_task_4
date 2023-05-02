import {usersCollectionOutput} from "../users/usersDomain";

export async function LoginDB(loginOrEmail : string, password : string) {
    const filter = {$and : [{$or : [{login : loginOrEmail}, {email : loginOrEmail}] }, {password : password}]}
    const foundUser = await usersCollectionOutput.findOne(filter)
    return foundUser;
}
