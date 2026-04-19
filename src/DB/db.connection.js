
import mongoose from "mongoose";
import envconfig from "../config/env.config.js";
const database = envconfig.database;

const dbconnection = async () => {

    try {
        await mongoose.connect(database.MongoURI);
       console.log('Database connected successfully');
    }
    catch (error) {
        console.log(error);
        console.log('Database connection failed');
    }
}
export default dbconnection;