import type { User } from "./user.js";

export interface DatabaseInfo {
    totalUsers: number;
    data: User[];
}
