import fs from "fs";
import path from "path";
import { DB_PATH } from "../constants.js";
import { DBSchema } from "../schemas/index.js";
import { registerWebhook } from "../services/payos.js";
import { decryptData, encryptData } from "../utils/encryption.js";

import ValidateError from "../errors/validateError.js";

import type { User } from "../interfaces/database/user.js";
import type { DatabaseInfo } from "../interfaces/database/db.js";

export class Database {
    private static instance: Database;
    private databaseInfo?: DatabaseInfo;

    private constructor() {}

    public async init(): Promise<void> {
        const absolutePath = path.resolve(process.cwd(), DB_PATH);
        if (!fs.existsSync(absolutePath))
            await fs.promises.writeFile(absolutePath, encryptData(JSON.stringify({ totalUsers: 0, data: [] })), {
                mode: 0o600,
            });

        const enc = await fs.promises.readFile(absolutePath, "utf-8");
        if (enc.length === 0) {
            await fs.promises.writeFile(absolutePath, encryptData(JSON.stringify({ totalUsers: 0, data: [] })), {
                mode: 0o600,
            });
            this.databaseInfo = { totalUsers: 0, data: [] };
        } else this.databaseInfo = JSON.parse(decryptData(enc));
    }

    public async save(): Promise<void> {
        const absolutePath = path.resolve(process.cwd(), DB_PATH);
        await fs.promises.writeFile(absolutePath, encryptData(JSON.stringify(this.databaseInfo)), { mode: 0o600 });
    }

    public async close(): Promise<void> {
        await this.save();
        this.databaseInfo = undefined;
    }

    public static getInstance(): Database {
        if (!Database.instance) Database.instance = new Database();

        return Database.instance;
    }

    public async getTotalUsers(): Promise<number> {
        if (!this.databaseInfo) await this.init();
        return this.databaseInfo!.totalUsers;
    }

    public async getUsers(isDebug?: boolean): Promise<Omit<User, "services" | "id">[]> {
        if (!this.databaseInfo) await this.init();

        if (isDebug) return this.databaseInfo!.data;

        return this.databaseInfo!.data.map((user) => {
            const { services, id, ...rest } = user;
            return rest;
        });
    }

    public async getUserById(id: string): Promise<User | undefined> {
        if (!this.databaseInfo) await this.init();
        return this.databaseInfo!.data.find((user) => user.id === id);
    }

    public async addUser(user: Omit<User, "id">): Promise<Omit<User, "services">> {
        if (!this.databaseInfo) await this.init();

        const result = await DBSchema.UserSchema(this.databaseInfo!.data).safeParseAsync(user);
        if (!result.success) throw new ValidateError("addUser", result.error.errors);

        if (user.services.payos) await registerWebhook(result.data);

        const validatedUser = result.data;
        this.databaseInfo!.totalUsers++;
        this.databaseInfo!.data.push(validatedUser);

        await this.save();
        return { id: validatedUser.id, email: validatedUser.email, ipnUrl: validatedUser.ipnUrl };
    }

    public async updateUser(user: User): Promise<Omit<User, "services">> {
        if (!this.databaseInfo) await this.init();

        const result = await DBSchema.UserSchema(this.databaseInfo!.data, { updateUser: user }).safeParseAsync(user);
        if (!result.success) throw new ValidateError("updateUser", result.error.errors);

        if (user.services.payos) await registerWebhook(result.data);

        this.databaseInfo!.data[this.databaseInfo!.data.findIndex((u) => u.id === user.id)] = result.data;
        await this.save();
        return { id: result.data.id, email: user.email, ipnUrl: user.ipnUrl };
    }

    public async deleteUser(id: string): Promise<boolean> {
        if (!this.databaseInfo) await this.init();

        const index = this.databaseInfo!.data.findIndex((u) => u.id === id);
        if (index === -1)
            throw new ValidateError("deleteUser", [{ code: "custom", message: "User not found", path: ["id"] }]);

        this.databaseInfo!.totalUsers--;
        this.databaseInfo!.data.splice(index, 1);

        await this.save();

        return true;
    }
}
