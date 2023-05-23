import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const dbName = 'forum'
const mongoURI = process.env.MONGO_URL || `mongodb://0.0.0.0:27017/${dbName}`




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