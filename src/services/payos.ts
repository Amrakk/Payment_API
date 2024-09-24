import axios, { isAxiosError } from "axios";
import { PAYOS_URL } from "../constants.js";
import { Database } from "../database/db.js";
import { isInt32 } from "../utils/number.js";
import { PayOSSchema } from "../schemas/index.js";
import { getIpnUrl } from "../utils/getIpnUrl.js";
import { isTestData } from "../utils/isTestData.js";
import { generateSignature } from "../utils/encryption.js";
import { PayOSResultHandler } from "../utils/resultHandler/index.js";

import ValidateError from "../errors/validateError.js";
import PaymentApiError from "../errors/paymentApiError.js";
import UnsupportedError from "../errors/unsupportedError.js";

import type { Response } from "express";
import type { User } from "../interfaces/database/user.js";
import type { IPayOS } from "../interfaces/bankingServices/index.js";

export async function getPaymentLink(
    body: IPayOS.PaymentLinkRequest,
    user: User
): Promise<IPayOS.PaymentLinkResponseData> {
    if (!user.services.payos) throw new UnsupportedError("PayOS", "getPaymentLink", user.email);
    const { apiKey, clientId, checksumKey } = user.services.payos;

    const result = await PayOSSchema.PaymentLinkRequestSchema.strict().safeParseAsync(body);
    if (!result.success) throw new ValidateError("getPaymentLink", result.error.errors);

    const { ...rest } = result.data;
    if (rest.expiredAt) rest.expiredAt = isInt32(rest.expiredAt) ? rest.expiredAt : Math.floor(rest.expiredAt / 1000);

    const rawSignature = `amount=${rest.amount}&cancelUrl=${rest.cancelUrl}&description=${rest.description}&orderCode=${rest.orderCode}&returnUrl=${rest.returnUrl}`;
    const signature = generateSignature(checksumKey, rawSignature, "payos");

    const res = await axios
        .post<IPayOS.PaymentLinkResponse>(
            `${PAYOS_URL}/v2/payment-requests`,
            {
                ...rest,
                signature: signature,
            },
            {
                headers: {
                    "x-api-key": apiKey,
                    "x-client-id": clientId,
                },
            }
        )
        .then((res) => PayOSResultHandler.resultHandler(res.status, res.data))
        .catch((err) => {
            if (isAxiosError<IPayOS.PaymentLinkResponse>(err) && err.response)
                return PayOSResultHandler.resultHandler(err.response.status, err.response.data);
            throw err;
        });

    return res.data;
}

export async function paymentLinkCallback(clientId: string, reqBody: IPayOS.PaymentLinkCallbackRequest, res: Response) {
    res.status(200).send({ success: true });

    if (isTestData("payos", reqBody.data)) return;

    const user = await Database.getInstance().getUserById(clientId);
    if (!user)
        throw new PaymentApiError("PayOS", "paymentLinkCallback", "User not found in database", { clientId, reqBody });

    await axios.post(user.ipnUrl, reqBody.data, {
        params: {
            service: "payos",
        },
    });
}

export async function transactionStatus(
    body: IPayOS.TransactionStatusRequest,
    user: User
): Promise<IPayOS.TransactionStatusResponseData> {
    if (!user.services.payos) throw new UnsupportedError("PayOS", "transactionStatus", user.email);
    const { apiKey, clientId, checksumKey } = user.services.payos;

    const result = await PayOSSchema.TransactionStatusRequestSchema.strict().safeParseAsync(body);
    if (!result.success) throw new ValidateError("transactionStatus", result.error.errors);

    const { id } = result.data;

    const res = await axios
        .get<IPayOS.TransactionStatusResponse>(`${PAYOS_URL}/v2/payment-requests/${id}`, {
            headers: {
                "x-api-key": apiKey,
                "x-client-id": clientId,
            },
        })
        .then((res) => PayOSResultHandler.resultHandler(res.status, res.data))
        .catch((err) => {
            if (isAxiosError<IPayOS.TransactionStatusResponse>(err) && err.response)
                return PayOSResultHandler.resultHandler(err.response.status, err.response.data);
            throw err;
        });

    return res.data;
}

export async function registerWebhook(user: User) {
    if (!user.services.payos) throw new UnsupportedError("PayOS", "registerWebhook", user.email);

    const { id } = user;
    const { apiKey, clientId } = user.services.payos;

    const ipnUrl = getIpnUrl("payos", id);
    await axios
        .post(
            `${PAYOS_URL}/confirm-webhook`,
            {
                webhookUrl: ipnUrl,
            },
            {
                headers: {
                    "x-api-key": apiKey,
                    "x-client-id": clientId,
                },
            }
        )
        .then((res) => PayOSResultHandler.resultHandler(res.status, res.data))
        .catch((err) => {
            if (isAxiosError<IPayOS.ResponsePayOS>(err) && err.response)
                PayOSResultHandler.resultHandler(err.response.status, err.response.data);
            throw err;
        });
}
