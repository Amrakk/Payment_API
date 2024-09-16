import { isAxiosError } from "axios";
import { Database } from "../../database/db.js";
import { errorLogger } from "../../middlewares/logger/loggers.js";
import { RESPONSE_CODE, RESPONSE_MESSAGE } from "../../interfaces/api/index.js";

import ValidateError from "../../errors/validateError.js";

import type { Request, Response } from "express";
import type { User } from "../../interfaces/database/user.js";
import type { IResponse } from "../../interfaces/api/index.js";

export async function getUsers(req: Request, res: Response<IResponse<Omit<User, "services" | "id">[]>>) {
    try {
        const users = await Database.getInstance().getUsers();
        return res.status(200).json({ code: RESPONSE_CODE.SUCCESS, message: RESPONSE_MESSAGE.SUCCESS, data: users });
    } catch (err) {
        if (err instanceof Error) errorLogger(err, req);
        return res
            .status(500)
            .send({ code: RESPONSE_CODE.INTERNAL_SERVER_ERROR, message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR });
    }
}

export async function getUserById(req: Request, res: Response<IResponse<User | undefined>>) {
    const user = req.context!.user;
    return res.status(200).json({ code: RESPONSE_CODE.SUCCESS, message: RESPONSE_MESSAGE.SUCCESS, data: user });
}

export async function createUser(req: Request, res: Response<IResponse<Omit<User, "services">>>) {
    const newUser = req.body;

    try {
        const result = await Database.getInstance().addUser(newUser);
        return res.status(201).json({ code: RESPONSE_CODE.SUCCESS, message: RESPONSE_MESSAGE.SUCCESS, data: result });
    } catch (err) {
        if (err instanceof ValidateError)
            return res
                .status(400)
                .send({ code: RESPONSE_CODE.VALIDATION_ERROR, message: RESPONSE_MESSAGE.VALIDATION_ERROR, error: err });
        if (isAxiosError(err) && err.status === 401)
            return res.status(401).json({
                code: RESPONSE_CODE.VALIDATION_ERROR,
                message: RESPONSE_MESSAGE.VALIDATION_ERROR,
                error: err.response?.data?.desc,
            });

        if (err instanceof Error) errorLogger(err, req);
        return res
            .status(500)
            .send({ code: RESPONSE_CODE.INTERNAL_SERVER_ERROR, message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR });
    }
}

export async function updateUser(req: Request, res: Response<IResponse<Omit<User, "services">>>) {
    const modifiedUser = req.body;

    try {
        const result = await Database.getInstance().updateUser(modifiedUser);
        return res.status(200).json({ code: RESPONSE_CODE.SUCCESS, message: RESPONSE_MESSAGE.SUCCESS, data: result });
    } catch (err) {
        if (err instanceof ValidateError)
            return res
                .status(400)
                .send({ code: RESPONSE_CODE.VALIDATION_ERROR, message: RESPONSE_MESSAGE.VALIDATION_ERROR, error: err });

        if (isAxiosError(err) && err.status === 401)
            return res.status(401).json({
                code: RESPONSE_CODE.VALIDATION_ERROR,
                message: RESPONSE_MESSAGE.VALIDATION_ERROR,
                error: err.response?.data?.desc,
            });

        if (err instanceof Error) errorLogger(err, req);
        return res
            .status(500)
            .send({ code: RESPONSE_CODE.INTERNAL_SERVER_ERROR, message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR });
    }
}

export async function deleteUser(req: Request, res: Response<IResponse<null>>) {
    const user = req.context!.user;

    try {
        await Database.getInstance().deleteUser(user!.id as string);
        return res.status(200).json({ code: RESPONSE_CODE.SUCCESS, message: RESPONSE_MESSAGE.SUCCESS });
    } catch (err) {
        if (err instanceof ValidateError)
            return res
                .status(400)
                .send({ code: RESPONSE_CODE.VALIDATION_ERROR, message: RESPONSE_MESSAGE.VALIDATION_ERROR, error: err });

        if (err instanceof Error) errorLogger(err, req);
        return res
            .status(500)
            .send({ code: RESPONSE_CODE.INTERNAL_SERVER_ERROR, message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR });
    }
}
