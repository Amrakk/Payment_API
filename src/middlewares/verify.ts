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
        console.log(err);

        return res
            .status(500)
            .send({ code: RESPONSE_CODE.INTERNAL_SERVER_ERROR, message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR });
    }
}
