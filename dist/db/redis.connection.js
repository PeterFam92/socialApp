"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConnection = exports.redisClient = void 0;
const redis_1 = require("redis");
const config_service_1 = require("../config/config.service");
exports.redisClient = (0, redis_1.createClient)({ url: config_service_1.REDIS_URI });
const redisConnection = async () => {
    try {
        await exports.redisClient.connect();
        console.log("redis connected successfully");
    }
    catch (error) {
        console.log("redis connection failed", error);
    }
};
exports.redisConnection = redisConnection;
