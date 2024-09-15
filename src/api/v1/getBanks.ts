import { isAxiosError } from "axios";
import { VietQR, Momo } from "../../services/index.js";
import { RESPONSE_CODE, RESPONSE_MESSAGE } from "../../interfaces/api/index.js";

import type { Request, Response } from "express";
import type { IBanks, IResponse } from "../../interfaces/api/index.js";

export async function getBanks(req: Request, res: Response<IResponse<IBanks>>) {
    const { service } = req.query;

    try {
        let banks: IBanks;

        if (service === "vietqr") banks = await VietQR.getBanks();
        else if (service === "momo") banks = await Momo.getBanks();

        if (!banks)
            return res
                .status(409)
                .send({ code: RESPONSE_CODE.SERVICE_NOT_FOUND, message: RESPONSE_MESSAGE.SERVICE_NOT_FOUND });

        return res.status(200).send({ code: RESPONSE_CODE.SUCCESS, message: RESPONSE_MESSAGE.SUCCESS, data: banks });
    } catch (err) {
        if (isAxiosError(err)) console.log(err.message); // TODO: log error
        else console.log(err); // TODO: log error
        return res
            .status(500)
            .send({ code: RESPONSE_CODE.INTERNAL_SERVER_ERROR, message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR });
    }
}
