import { number } from "zod";
import { redisClient } from "./redis.connection";
import { Types } from "mongoose";

interface tokenParams{
    userId:string|number
}
interface revokeToken extends tokenParams{
    jti:string
}

interface redisSetParams{
    key:string,
    value:any,
    ttl?:number |null
}


export const revokeTokenKeyPrefix = ({ userId }:tokenParams):string => {
  return `user:revokeToken:${userId}`;
};

export const revokeTokenKey = ({ userId, jti }:revokeToken):string => {
  return `${revokeTokenKeyPrefix({ userId })}:${jti}`;
};

// set a key-value pair
export const set = async ({ key, value, ttl = null }:redisSetParams):Promise<string|null> => {
  try {
    const data = typeof value != "string" ? JSON.stringify(value) : value;

    if (ttl) {
      return await redisClient.set(key, data, {
        EX: ttl,
      });
    } else {
      return await redisClient.set(key, data);
    }
  } catch (error) {
    console.error("Redis failed to set key-value pair", error);
      return null

  }
};

// get a value by key
export const get = async ({ key }:{key:string}):Promise<string|null>  => {
  try {
    const data = await redisClient.get(key);
    return data;
  } catch (error) {
    console.error("Redis failed to get value by key", error);
    return null
  }
};

// update a value by key
export const update = async ({ key, value, ttl = null }:redisSetParams):Promise<string|null|boolean>  => {
  try {
    const isExists = await redisClient.exists(key);
    if (!isExists) return false;
    const data = typeof value != "string" ? JSON.stringify(value) : value;

    if (ttl) {
      return await redisClient.set(key, data, {
        EX: ttl,
      });
    } else {
      return await redisClient.set(key, data);
    }
  } catch (error) {
    console.error("Redis failed to update value by key", error);
    return null;
  }
};

// delete a value by key
export const del = async ({ key }:{key:string}):Promise<number|null |boolean>  => {
  try {
    const isExists = await redisClient.exists(key);
    if (!isExists) return false;
    return await redisClient.del(key);
  } catch (error) {
    console.error("Redis failed to delete value by key", error);
    return null
  }
};

// expire a key with an absolute timestamp
export const expire = async ({ key, ttl }:{key:string,ttl:number}):Promise<boolean|number|null>  => {
  try {
    const isExists = await redisClient.exists(key);
    if (!isExists) return false;
    return await redisClient.expireAt(key, ttl);
  } catch (error) {
    console.error("Redis failed to expire key", error);
    return null
  }
};

//  TTL of a key
export const ttl = async ({ key }:{key:string}):Promise<boolean|number|null> => {
  try {
    const isExists = await redisClient.exists(key);
    if (!isExists) return false;
    return await redisClient.ttl(key);
  } catch (error) {
    console.error("Redis failed to get TTL of key", error);
    return null
  }
};

// keys pattern
export const keys = async ({ pattern }:{pattern:string}):Promise<string[]|null>  => {
  try {
    return await redisClient.keys(pattern);
  } catch (error) {
    console.error("Redis failed to get keys by pattern", error);
    return null
  }
};

export const FCM_KeY=(userId:Types.ObjectId|string)=>{
  return `user:FCM:${userId.toString()}`
}

export const addFCM=async (userId:Types.ObjectId|string,FCMToken:string)=>{
  return await redisClient.sAdd(FCM_KeY(userId),FCMToken)
}


export const removeFCM=async (userId:Types.ObjectId|string,FCMToken:string)=>{
  return await redisClient.sRem(FCM_KeY(userId),FCMToken)
}

export const getFCM=async (userId:Types.ObjectId|string)=>{
  return await redisClient.sMembers(FCM_KeY(userId))
}

