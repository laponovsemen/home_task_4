import mongoose from 'mongoose'
import {appSettings} from "../app-settings";


const dbName = 'forum'
const mongoURI = appSettings.MONGO_URL




export async function runDb(){
    try {
        await mongoose.connect(mongoURI)
        console.log("mongoURI "  + mongoURI)
        console.log("successfully connected to server")
    } catch (e) {
        console.log("server connection failed")
        console.log("mongoURI "  + mongoURI)
        await mongoose.disconnect()
    }
}