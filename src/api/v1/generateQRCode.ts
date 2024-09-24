import { VietQR } from "../../services/index.js";
import { RESPONSE_CODE, RESPONSE_MESSAGE } from "../../interfaces/api/index.js";

import type { NextFunction, Request, Response } from "express";
import type { IResponse, IGetQRCode } from "../../interfaces/api/index.js";

export async function generateQRCode(req: Request, res: Response<IResponse<IGetQRCode>>, next: NextFunction) {
    const { service } = req.query;

    try {
        let result: IGetQRCode;
        if (service === "vietqr") result = await VietQR.getQRCode(req.body);

        if (!result)
            return res
                .status(409)
                .send({ code: RESPONSE_CODE.SERVICE_NOT_FOUND, message: RESPONSE_MESSAGE.SERVICE_NOT_FOUND });

        return res.status(200).send({ code: RESPONSE_CODE.SUCCESS, message: RESPONSE_MESSAGE.SUCCESS, data: result });
    } catch (err) {
        next(err);
    }
}
