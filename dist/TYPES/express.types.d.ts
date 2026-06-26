import { HUserDocument } from "../db/models/user.model";
import { customJwtPayload } from "../utils/services/token";
declare module "express-serve-static-core" {
    interface Request {
        user: HUserDocument;
        decoded: customJwtPayload;
    }
}
