import type { User } from "./interfaces/database/user.js";

declare global {
    namespace Express {
        interface Request {
            context?: {
                user: User;
            };
        }
    }
}
