import {usersCollectionOutput} from "../users/usersDomain";
import {client} from "../db";
import {spoiledTokenType, userViewModel} from "../appTypes";

const spoiledTokensCollection = client.db("forum").collection<spoiledTokenType>("spoiledTokens")
export async function LoginDB(loginOrEmail : string, password : string) {
    const filter = {$and : [{$or : [{"accountData.login" : loginOrEmail}, {"accountData.email" : loginOrEmail}] }, {"accountData.password" : password}]}
    const foundUser = await usersCollectionOutput.findOne(filter)
    return foundUser;
}
export async function addOldTokensAsProhibitedDB(typeOfToken : string, token : string) {
    if(typeOfToken !== "access" && typeOfToken !== "refresh") return
    try {
        await spoiledTokensCollection.insertOne({typeOfToken: typeOfToken, token: token})
    } catch (e) {
        console.log(e)
    }
}

export async function  refreshTokenSpoilness(refreshToken : string) {
    return await spoiledTokensCollection.findOne({typeOfToken: "refresh", token: refreshToken})
}
export async function  accessTokenSpoilness(accessToken : string) {
    return await spoiledTokensCollection.findOne({typeOfToken: "access", token: accessToken})
}


