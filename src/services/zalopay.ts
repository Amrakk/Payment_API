import { Database } from "../database/db";
import { ZALOPAY_URL } from "../constants";
import { ZaloPaySchema } from "../schemas";
import axios, { isAxiosError } from "axios";
import { getIpnUrl } from "../utils/getIpnUrl";
import { generateSignature } from "../utils/encryption";
import { ZaloPayResultHandler } from "../utils/resultHandler";

import ValidateError from "../errors/validateError";
import PaymentApiError from "../errors/paymentAPIError";
import UnsupportedError from "../errors/unsupportedError";

import type { User } from "../interfaces/database/user";
import type { IZaloPay } from "../interfaces/bankingServices";
import type { Response } from "express";

export async function getBanks(appid: string, key1: string) {
    const reqtime = Date.now();
    const mac = generateSignature(key1, `${appid}|${reqtime}`, "zalopay");

    return axios
        .post<IZaloPay.GetBanksResponse>(
            "https://sbgateway.zalopay.vn/api/getlistmerchantbanks",
            { appid, reqtime, mac },
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then((res) => res.data.banks);
}

export async function getPaymentLink(body: IZaloPay.PaymentLinkRequestInput, user: User) {
    if (!user.services.zalopay) throw new UnsupportedError("zalopay", "getPaymentLink", user.email);
    const { appid, key1 } = user.services.zalopay;

    const result = await ZaloPaySchema.PaymentLinkRequestInputSchema.strict().safeParseAsync(body);
    if (!result.success) throw new ValidateError("getPaymentLink", result.error.errors);

    const apiIpnUrl = getIpnUrl("zalopay", user.id);
    const { app_trans_id, app_user, amount, app_time, embed_data, item } = result.data;

    const rawSignature = `${appid}|${app_trans_id}|${app_user}|${amount}|${app_time}|${embed_data}|${item}`;
    const mac = generateSignature(key1, rawSignature, "zalopay");

    const response = await axios
        .post<IZaloPay.PaymentLinkResponse>(`${ZALOPAY_URL}/create`, {
            ...result.data,
            app_id: appid,
            mac,
            callback_url: apiIpnUrl,
        })
        .then((res) => ZaloPayResultHandler.resultHandler(res.status, res.data))
        .catch((err) => {
            if (isAxiosError<IZaloPay.PaymentLinkResponse>(err) && err.response)
                return ZaloPayResultHandler.resultHandler(err.response.status, err.response.data);
            throw err;
        });

    return response;
}

export async function paymentLinkCallback(clientId: string, body: IZaloPay.PaymentLinkCallbackRequest, res: Response) {
    res.status(200).send({ return_code: 1, return_message: "success" });

    const user = await Database.getInstance().getUserById(clientId);
    if (!user)
        throw new PaymentApiError("ZaloPay", "paymentLinkCallback", "User not found in database", { clientId, body });

    const data = JSON.parse(body.data) as IZaloPay.PaymentLinkCallbackRequestData;

    await axios.post(user.ipnUrl, data, {
        params: {
            service: "zalopay",
        },
    });
}

export async function transactionStatus(
    body: IZaloPay.TransactionStatusRequestInput,
    user: User
): Promise<IZaloPay.TransactionStatusResponse> {
    if (!user.services.zalopay) throw new UnsupportedError("zalopay", "transactionStatus", user.email);
    const { appid, key1 } = user.services.zalopay;

    const result = await ZaloPaySchema.TransactionStatusRequestInputSchema.safeParseAsync(body);
    if (!result.success) throw new ValidateError("getPaymentLink", result.error.errors);

    const { app_trans_id } = result.data;

    var rawSignature = `${appid}|${app_trans_id}|${key1}`;
    var mac = generateSignature(key1, rawSignature, "zalopay");

    const response = await axios
        .post<IZaloPay.TransactionStatusResponse>(`${ZALOPAY_URL}/query`, {
            app_id: appid,
            app_trans_id,
            mac,
        })
        .then((res) => ZaloPayResultHandler.resultHandler(res.status, res.data))
        .catch((err) => {
            if (isAxiosError<IZaloPay.TransactionStatusResponse>(err) && err.response)
                return ZaloPayResultHandler.resultHandler(err.response.status, err.response.data);
            throw err;
        });

    return response;
}
