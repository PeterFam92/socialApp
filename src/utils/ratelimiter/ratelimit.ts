import { NextFunction,Request,Response } from "express";


type IpRequestData={
    count:number;
    startTime:number;
}

const ipRequests:Record<string,IpRequestData>={};

const blockedIps:Set<string>=new Set();
const unblockedTimers:Map<string,NodeJS.Timeout>=new Map();

const RATE_LIMIT=10;
const WINDOW=60*1000;

export const customRateLimiter=(req:Request,res:Response,next:NextFunction)=>{
    const ip=req.ip ||"unknown";    
    const currentTime=Date.now();

    if(blockedIps.has(ip)){
        return res.status(403).json({message:"You have been blocked. Try again later."});
    } 
    if(!ipRequests[ip]){
        ipRequests[ip]={count:1,startTime:currentTime};
        return next();
    }
    const diff=currentTime-ipRequests[ip].startTime;
    if(diff<WINDOW){
        ipRequests[ip].count++;
        if(ipRequests[ip].count>RATE_LIMIT){
            blockedIps.add(ip);
            if(!unblockedTimers.has(ip)){
                const timer=setTimeout(()=>{
                    blockedIps.delete(ip);
                    unblockedTimers.delete(ip);
                },WINDOW);
                unblockedTimers.set(ip,timer);
            }
            return res.status(429).json({message:"Too many requests. Try again later."});
        }
    } else {
        ipRequests[ip]={count:1,startTime:currentTime};
    }

    next();     } 
    
