
import express, { Express, NextFunction, Request, Response } from "express";

import cors from "cors";
import helmet from "helmet";
import { customRateLimiter } from "./utils/ratelimiter/ratelimit";
import { authRouter, postRouter, commentsRouter, userRouter } from "./modules";
import { globalErrorHandler, NotFoundException } from "./utils/response/error.response";
import { corsOptions } from "./utils/cors/cors.utils";
import { PORT } from "./config/config.service";
import connectDB from "./db/connection";
import { redisConnection } from "./db/redis.connection";
import { notification, NotificationService } from "./utils/services/notification.service";
import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { createHandler } from "graphql-http";



export const bootstrap = async () => {
    const app: Express = express();
    app.use(express.json(), cors(corsOptions), helmet(), customRateLimiter);

    app.get("/", (req: Request, res: Response, next: NextFunction) => {
        return res.status(200).json({ message: "welcome to social app!" });
    });
    app.post("/send-notification", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await notification.sendNotification({
                token: req.body.token,
                data: { title: "first notification", body: "body of notification" }
            });
            res.status(200).json({ message: "Notification sent successfully", data: result });
        } catch (error) {
            next(error);
        }
    });

const schema= new GraphQLSchema({
    query:new GraphQLObjectType({
        name:"RootQueryType",
        description:"first description optional",
        fields:{
            sayHi:{
                type:GraphQLString,
                resolve(){return "hello from graphql api"}
            }
        }
    }),
})

app.all("/graphql" , createHandler({schema}))
    await connectDB()
    await redisConnection()
    app.use("/api/auth", authRouter);
    app.use("/api/post", postRouter);
    app.use("/api/users", userRouter);

    app.use("/*dummy", (req: Request, res: Response, next: NextFunction) => {
        throw new NotFoundException("Route not found");
    });

    app.use(globalErrorHandler);
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

}