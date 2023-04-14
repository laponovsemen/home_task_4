import {MongoClient} from "mongodb";
import dotenv from 'dotenv'
dotenv.config()


const MongoURI = process.env.MONGO_URL || "mongodb://0.0.0.0:27017"
export const client = new MongoClient(MongoURI)
export async function runDb(){
    try {
        console.log(MongoURI)
        await client.connect()
        await client.db().command({ping: 1})
        console.log("successfully connected to server")
    } catch (e){
        await client.close()
        console.log("server connection failed")
    }
}