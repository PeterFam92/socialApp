"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFCM = exports.removeFCM = exports.addFCM = exports.FCM_KeY = exports.keys = exports.ttl = exports.expire = exports.del = exports.update = exports.get = exports.set = exports.revokeTokenKey = exports.revokeTokenKeyPrefix = void 0;
const redis_connection_1 = require("./redis.connection");
const revokeTokenKeyPrefix = ({ userId }) => {
    return `user:revokeToken:${userId}`;
};
exports.revokeTokenKeyPrefix = revokeTokenKeyPrefix;
const revokeTokenKey = ({ userId, jti }) => {
    return `${(0, exports.revokeTokenKeyPrefix)({ userId })}:${jti}`;
};
exports.revokeTokenKey = revokeTokenKey;
// set a key-value pair
const set = async ({ key, value, ttl = null }) => {
    try {
        const data = typeof value != "string" ? JSON.stringify(value) : value;
        if (ttl) {
            return await redis_connection_1.redisClient.set(key, data, {
                EX: ttl,
            });
        }
        else {
            return await redis_connection_1.redisClient.set(key, data);
        }
    }
    catch (error) {
        console.error("Redis failed to set key-value pair", error);
        return null;
    }
};
exports.set = set;
// get a value by key
const get = async ({ key }) => {
    try {
        const data = await redis_connection_1.redisClient.get(key);
        return data;
    }
    catch (error) {
        console.error("Redis failed to get value by key", error);
        return null;
    }
};
exports.get = get;
// update a value by key
const update = async ({ key, value, ttl = null }) => {
    try {
        const isExists = await redis_connection_1.redisClient.exists(key);
        if (!isExists)
            return false;
        const data = typeof value != "string" ? JSON.stringify(value) : value;
        if (ttl) {
            return await redis_connection_1.redisClient.set(key, data, {
                EX: ttl,
            });
        }
        else {
            return await redis_connection_1.redisClient.set(key, data);
        }
    }
    catch (error) {
        console.error("Redis failed to update value by key", error);
        return null;
    }
};
exports.update = update;
// delete a value by key
const del = async ({ key }) => {
    try {
        const isExists = await redis_connection_1.redisClient.exists(key);
        if (!isExists)
            return false;
        return await redis_connection_1.redisClient.del(key);
    }
    catch (error) {
        console.error("Redis failed to delete value by key", error);
        return null;
    }
};
exports.del = del;
// expire a key with an absolute timestamp
const expire = async ({ key, ttl }) => {
    try {
        const isExists = await redis_connection_1.redisClient.exists(key);
        if (!isExists)
            return false;
        return await redis_connection_1.redisClient.expireAt(key, ttl);
    }
    catch (error) {
        console.error("Redis failed to expire key", error);
        return null;
    }
};
exports.expire = expire;
//  TTL of a key
const ttl = async ({ key }) => {
    try {
        const isExists = await redis_connection_1.redisClient.exists(key);
        if (!isExists)
            return false;
        return await redis_connection_1.redisClient.ttl(key);
    }
    catch (error) {
        console.error("Redis failed to get TTL of key", error);
        return null;
    }
};
exports.ttl = ttl;
// keys pattern
const keys = async ({ pattern }) => {
    try {
        return await redis_connection_1.redisClient.keys(pattern);
    }
    catch (error) {
        console.error("Redis failed to get keys by pattern", error);
        return null;
    }
};
exports.keys = keys;
const FCM_KeY = (userId) => {
    return `user:FCM:${userId.toString()}`;
};
exports.FCM_KeY = FCM_KeY;
const addFCM = async (userId, FCMToken) => {
    return await redis_connection_1.redisClient.sAdd((0, exports.FCM_KeY)(userId), FCMToken);
};
exports.addFCM = addFCM;
const removeFCM = async (userId, FCMToken) => {
    return await redis_connection_1.redisClient.sRem((0, exports.FCM_KeY)(userId), FCMToken);
};
exports.removeFCM = removeFCM;
const getFCM = async (userId) => {
    return await redis_connection_1.redisClient.sMembers((0, exports.FCM_KeY)(userId));
};
exports.getFCM = getFCM;
