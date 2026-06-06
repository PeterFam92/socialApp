import mongoose from "mongoose";
import { DB_URI } from "../config/config.service";


const connectDB = async () => {
  try {
   
    const connection = await mongoose.connect(DB_URI as string    , {
        serverSelectionTimeoutMS: 5000, 
    });

      console.log(`MongoDb connected :${connection.connection.host}`);

    
  } catch (error) {
    console.log(`Error :${(error as Error).message}`);
    
  }};
export default connectDB;