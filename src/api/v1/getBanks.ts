import { Database } from "../../database/db.js";
import { VietQR, Momo, VNPay, ZaloPay } from "../../services/index.js";
import { RESPONSE_CODE, RESPONSE_MESSAGE } from "../../interfaces/api/index.js";

import type { NextFunction, Request, Response } from "express";
import type { IBanks, IResponse } from "../../interfaces/api/index.js";

export async function getBanks(req: Request, res: Response<IResponse<IBanks>>, next: NextFunction) {
    const { service } = req.query;

    try {
        let banks: IBanks;

        if (service === "vietqr") banks = await VietQR.getBanks();
        else if (service === "momo") banks = await Momo.getBanks();
        else if (service === "vnpay") {
            const clientId = req.headers["x-client-id"];
            const user = await Database.getInstance().getUserById(clientId as string);

            const tmnCode = user?.services.vnpay?.tmnCode;
            if (!tmnCode)
                return res.status(400).send({
                    code: RESPONSE_CODE.BAD_REQUEST,
                    message: RESPONSE_MESSAGE.BAD_REQUEST,
                    error: "User not found or VNPay service not set",
                });

            banks = await VNPay.getBanks(tmnCode);
        } else if (service === "zalopay") {
            const clientId = req.headers["x-client-id"];
            const user = await Database.getInstance().getUserById(clientId as string);

            if (!user?.services.zalopay)
                return res.status(400).send({
                    code: RESPONSE_CODE.BAD_REQUEST,
                    message: RESPONSE_MESSAGE.BAD_REQUEST,
                    error: "User not found or ZaloPay service not set",
                });
            const { appid, key1 } = user.services.zalopay;

            banks = await ZaloPay.getBanks(appid, key1);
        }

        if (!banks)
            return res
                .status(409)
                .send({ code: RESPONSE_CODE.SERVICE_NOT_FOUND, message: RESPONSE_MESSAGE.SERVICE_NOT_FOUND });

        return res.status(200).send({ code: RESPONSE_CODE.SUCCESS, message: RESPONSE_MESSAGE.SUCCESS, data: banks });
    } catch (err) {
        next(err);
    }
}
