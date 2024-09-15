import axios from "axios";
import { MOMO_URL } from "../constants.js";
import { Database } from "../database/db.js";
import { MomoSchema } from "../schemas/index.js";
import { getIpnUrl } from "../utils/getIpnUrl.js";
import { generateSignature } from "../utils/encryption.js";
import { TransactionStatusRequestInputSchema } from "../schemas/momo.js";

import ValidateError from "../errors/validateError.js";
import UnsupportedError from "../errors/unsupportedError.js";

import type { Response } from "express";
import type { IMomo } from "../interfaces/bankingServices/index.js";
import type { User } from "../interfaces/database/user.js";

export async function getBanks(): Promise<IMomo.ResponseGetBanks> {
    return axios.get<IMomo.ResponseGetBanks>(`${MOMO_URL}/bankcodes`).then((res) => res.data);
}

export async function getPaymentLink(
    body: IMomo.PaymentLinkRequestInput,
    user: User
): Promise<IMomo.PaymentLinkResponse> {
    if (!user.services.momo) throw new UnsupportedError("momo", "getPaymentLink", user.email);
    const { accessKey, secretKey, partnerCode } = user.services.momo;

    const result = await MomoSchema.PaymentLinkRequestInputSchema.strict().safeParseAsync(body);
    if (!result.success) throw new ValidateError("getPaymentLink", result.error.errors);

    const { ...rest } = result.data;
    const apiIpnUrl = getIpnUrl("momo", user.id);

    const rawSignature = `accessKey=${accessKey}&amount=${rest.amount}&extraData=${rest.extraData}&ipnUrl=${apiIpnUrl}&orderId=${rest.orderId}&orderInfo=${rest.orderInfo}&partnerCode=${partnerCode}&redirectUrl=${rest.redirectUrl}&requestId=${rest.requestId}&requestType=${rest.requestType}`;
    const signature = generateSignature(secretKey, rawSignature, "momo");

    const response = await axios.post<IMomo.PaymentLinkResponse>(`${MOMO_URL}/create`, {
        ...rest,
        ipnUrl: apiIpnUrl,
        signature: signature,
    });

    // TODO: handle response error. (should handle response code from momo)

    return response.data;
}

export async function paymentLinkCallback(clientId: string, reqBody: IMomo.PaymentLinkCallbackRequest, res: Response) {
    res.status(204);

    const user = await Database.getInstance().getUserById(clientId);

    if (user)
        await axios.post(user.ipnUrl, reqBody, {
            params: {
                service: "momo",
            },
        });
}

export async function transactionStatus(
    body: IMomo.TransactionStatusRequestInput,
    user: User
): Promise<IMomo.TransactionStatusResponse> {
    if (!user.services.momo) throw new UnsupportedError("momo", "transactionStatus", user.email);
    const { accessKey, secretKey, partnerCode } = user.services.momo;

    const result = await TransactionStatusRequestInputSchema.strict().safeParseAsync(body);
    if (!result.success) throw new ValidateError("getPaymentLink", result.error.errors);

    const { ...rest } = result.data;

    var rawSignature = `accessKey=${accessKey}&orderId=${rest.orderId}&partnerCode=${partnerCode}&requestId=${rest.requestId}`;
    var signature = generateSignature(secretKey, rawSignature, "momo");

    const response = await axios.post<IMomo.TransactionStatusResponse>(`${MOMO_URL}/query`, {
        ...rest,
        signature: signature,
    });

    // TODO: handle response error. (should handle response code from momo)

    return response.data;
}
