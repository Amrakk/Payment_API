import { Database } from "../../database/db.js";
import { RESPONSE_CODE, RESPONSE_MESSAGE } from "../../interfaces/api/index.js";

import type { User } from "../../interfaces/database/user.js";
import type { IResponse } from "../../interfaces/api/index.js";
import type { NextFunction, Request, Response } from "express";

export async function getUsers(
    req: Request,
    res: Response<IResponse<Omit<User, "services" | "id">[]>>,
    next: NextFunction
) {
    const debugKey = req.headers["x-debug-key"];
    // TODO: verify debug key

    try {
        const users = await Database.getInstance().getUsers(debugKey !== undefined);
        return res.status(200).json({ code: RESPONSE_CODE.SUCCESS, message: RESPONSE_MESSAGE.SUCCESS, data: users });
    } catch (err) {
        next(err);
    }
}

export async function getUserById(req: Request, res: Response<IResponse<User | undefined>>) {
    const user = req.context!.user;
    return res.status(200).json({ code: RESPONSE_CODE.SUCCESS, message: RESPONSE_MESSAGE.SUCCESS, data: user });
}

export async function createUser(req: Request, res: Response<IResponse<Omit<User, "services">>>, next: NextFunction) {
    const newUser = req.body;

    try {
        const result = await Database.getInstance().addUser(newUser);
        return res.status(201).json({ code: RESPONSE_CODE.SUCCESS, message: RESPONSE_MESSAGE.SUCCESS, data: result });
    } catch (err) {
        next(err);
    }
}

export async function updateUser(req: Request, res: Response<IResponse<Omit<User, "services">>>, next: NextFunction) {
    const modifiedUser = req.body;

    try {
        const result = await Database.getInstance().updateUser(modifiedUser);
        return res.status(200).json({ code: RESPONSE_CODE.SUCCESS, message: RESPONSE_MESSAGE.SUCCESS, data: result });
    } catch (err) {
        next(err);
    }
}

export async function deleteUser(req: Request, res: Response<IResponse<User>>, next: NextFunction) {
    const user = req.context!.user;

    try {
        await Database.getInstance().deleteUser(user!.id as string);
        return res.status(200).json({ code: RESPONSE_CODE.SUCCESS, message: RESPONSE_MESSAGE.SUCCESS, data: user });
    } catch (err) {
        next(err);
    }
}
