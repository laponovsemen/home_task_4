import {usersModel} from "../mongo/mongooseSchemas";


export async function LoginDB(loginOrEmail : string, password : string) {
    const filter = {$and : [{$or : [{"accountData.login" : loginOrEmail}, {"accountData.email" : loginOrEmail}] }, {"accountData.password" : password}]}
    return usersModel.findOne(filter);
}


