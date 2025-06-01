import { Momo, PayOS, VNPay } from "../../services/index.js";
import { errorLogger } from "../../middlewares/logger/loggers.js";
import { RESPONSE_CODE, RESPONSE_MESSAGE } from "../../interfaces/api/index.js";

import type { NextFunction, Request, Response } from "express";
import type { IPaymentLink, IResponse } from "../../interfaces/api/index.js";

export async function paymentLink(req: Request, res: Response<IResponse<IPaymentLink>>, next: NextFunction) {
    const { service } = req.query;
    const user = req.context!.user;

    try {
        let result: IPaymentLink;

        if (service === "momo") result = await Momo.getPaymentLink(req.body, user);
        else if (service === "payos") result = await PayOS.getPaymentLink(req.body, user);
        else if (service === "vnpay") {
            const vnp_IpAddr =
                req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress;
            result = await VNPay.getPaymentLink({ ...req.body, vnp_IpAddr }, user);
        }

        if (!result)
            return res
                .status(409)
                .send({ code: RESPONSE_CODE.SERVICE_NOT_FOUND, message: RESPONSE_MESSAGE.SERVICE_NOT_FOUND });

        return res.status(200).send({ code: RESPONSE_CODE.SUCCESS, message: RESPONSE_MESSAGE.SUCCESS, data: result });
    } catch (err) {
        next(err);
    }
}

export async function paymentLinkCallback(req: Request, res: Response) {
    const { service, token } = req.query;

    try {
        if (service === "momo") return await Momo.paymentLinkCallback(token as string, req.body, res);
        if (service === "payos") return await PayOS.paymentLinkCallback(token as string, req.body, res);

        return res
            .status(409)
            .send({ code: RESPONSE_CODE.SERVICE_NOT_FOUND, message: RESPONSE_MESSAGE.SERVICE_NOT_FOUND });
    } catch (err) {
        if (err instanceof Error) errorLogger(err, req);
    }
}
