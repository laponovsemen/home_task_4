import {usersCollectionOutput} from "../users/usersDomain";

export async function LoginDB(loginOrEmail : string, password : string) {
    const filter = {$and : [{$or : [{"accountData.login" : loginOrEmail}, {"accountData.email" : loginOrEmail}] }, {"accountData.password" : password}]}
    const foundUser = await usersCollectionOutput.findOne(filter)
    return foundUser;
}
