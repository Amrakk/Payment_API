import { Database } from "../database/db.js";
import { RESPONSE_CODE, RESPONSE_MESSAGE } from "../interfaces/api/index.js";

import type { IResponse } from "../interfaces/api/index.js";
import type { Request, Response, NextFunction } from "express";

export async function verify(req: Request, res: Response<IResponse<unknown>>, next: NextFunction) {
    const clientId = req.headers["x-client-id"];

    try {
        const user = await Database.getInstance().getUserById(clientId as string);

        if (!user)
            return res.status(401).send({ code: RESPONSE_CODE.UNAUTHORIZED, message: RESPONSE_MESSAGE.UNAUTHORIZED });

        req.context = { user };

        next();
    } catch (err) {
        next(err);
    }
}
