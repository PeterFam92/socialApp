import { createClient } from "redis";
import{REDIS_URI}from"../config/config.service"

export const redisClient = createClient({url:REDIS_URI as string})

export const redisConnection=async()=>{
    try {
        await redisClient.connect()
        console.log("redis connected successfully");
        
    } catch (error) {
        console.log("redis connection failed",error);
        
    }
}
