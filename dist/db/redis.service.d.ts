import { Types } from "mongoose";
interface tokenParams {
    userId: string | number;
}
interface revokeToken extends tokenParams {
    jti: string;
}
interface redisSetParams {
    key: string;
    value: any;
    ttl?: number | null;
}
export declare const revokeTokenKeyPrefix: ({ userId }: tokenParams) => string;
export declare const revokeTokenKey: ({ userId, jti }: revokeToken) => string;
export declare const set: ({ key, value, ttl }: redisSetParams) => Promise<string | null>;
export declare const get: ({ key }: {
    key: string;
}) => Promise<string | null>;
export declare const update: ({ key, value, ttl }: redisSetParams) => Promise<string | null | boolean>;
export declare const del: ({ key }: {
    key: string;
}) => Promise<number | null | boolean>;
export declare const expire: ({ key, ttl }: {
    key: string;
    ttl: number;
}) => Promise<boolean | number | null>;
export declare const ttl: ({ key }: {
    key: string;
}) => Promise<boolean | number | null>;
export declare const keys: ({ pattern }: {
    pattern: string;
}) => Promise<string[] | null>;
export declare const FCM_KeY: (userId: Types.ObjectId | string) => string;
export declare const addFCM: (userId: Types.ObjectId | string, FCMToken: string) => Promise<number>;
export declare const removeFCM: (userId: Types.ObjectId | string, FCMToken: string) => Promise<number>;
export declare const getFCM: (userId: Types.ObjectId | string) => Promise<string[]>;
export {};
