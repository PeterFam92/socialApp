import { CorsOptions } from "cors";
import { WHILE_LIST } from "../../config/config.service";

const whitelist: string[] = WHILE_LIST;
export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }   },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}
       