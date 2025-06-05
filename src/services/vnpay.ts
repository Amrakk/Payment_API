import axios, { isAxiosError } from "axios";
import { VNPaySchema } from "../schemas";
import { Database } from "../database/db";
import { generateSignature } from "../utils/encryption";
import { VNPAY_URL, VNPAY_VERSION } from "../constants";
import { VNPayResultHandler } from "../utils/resultHandler";
import { objectToQueryString, sortObjectByKeys } from "../utils/objectHandlers";
import { SUPPORTED_LANG, VNPAY_COMMAND, VNPAY_CURRENCY, VNPAY_ORDER_TYPE } from "../interfaces/bankingServices/vnpay";

import ValidateError from "../errors/validateError";
import PaymentApiError from "../errors/paymentAPIError";
import UnsupportedError from "../errors/unsupportedError";

import type { User } from "../interfaces/database/user";
import type { IVNPay } from "../interfaces/bankingServices/";
import type { Response } from "express";

export async function getBanks(tmnCode: string): Promise<IVNPay.Bank[]> {
    return axios
        .post<IVNPay.Bank[]>(
            `${VNPAY_URL}/qrpayauth/api/merchant/get_bank_list`,
            { tmn_code: tmnCode },
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then((res) => res.data);
}

export async function getPaymentLink(body: IVNPay.PaymentLinkRequestInput & { vnp_IpAddr: string }, user: User) {
    if (!user.services.vnpay) throw new UnsupportedError("VNPay", "getPaymentLink", user.email);

    const { tmnCode, hashSecret } = user.services.vnpay;

    const result = await VNPaySchema.PaymentLinkRequestInputSchema.strict().safeParseAsync(body);
    if (!result.success) throw new ValidateError("getPaymentLink", result.error.errors);

    const params = sortObjectByKeys({
        ...result.data,
        vnp_Version: VNPAY_VERSION,
        vnp_Command: VNPAY_COMMAND.PAY,
        vnp_TmnCode: tmnCode,
        vnp_Locale: SUPPORTED_LANG.VN,
        vnp_CurrCode: VNPAY_CURRENCY.VND,
        vnp_OrderType: VNPAY_ORDER_TYPE.OTHER,
    }) as Omit<IVNPay.PaymentLinkRequest, "vnp_SecureHash">;

    const rawSignature = objectToQueryString(params);
    const signature = generateSignature(hashSecret, rawSignature, "vnpay");

    const url = `${VNPAY_URL}/paymentv2/vpcpay.html`;
    const { vnp_Amount, vnp_CreateDate, vnp_ExpireDate, vnp_OrderInfo, vnp_TxnRef, vnp_BankCode } = result.data;

    return {
        vnp_TxnRef,
        vnp_BankCode,
        vnp_Amount,
        vnp_OrderInfo,
        vnp_ExpireDate,
        vnp_CreateDate,
        checkoutUrl: `${url}?${rawSignature}&vnp_SecureHash=${signature}`,
    } as IVNPay.PaymentLinkResponse;
}

export async function paymentLinkCallback(clientId: string, query: IVNPay.PaymentLinkCallbackRequest, res: Response) {
    res.status(200).send({
        RspCode: "00",
        Message: "Confirm Success",
    });

    const user = await Database.getInstance().getUserById(clientId);
    if (!user)
        throw new PaymentApiError("VNPay", "paymentLinkCallback", "User not found in database", { clientId, query });

    await axios.post(user.ipnUrl, query, {
        params: {
            service: "vnpay",
        },
    });
}

export async function transactionStatus(
    body: IVNPay.TransactionStatusRequestInput,
    user: User
): Promise<IVNPay.TransactionStatusResponse> {
    if (!user.services.vnpay) throw new UnsupportedError("vnpay", "transactionStatus", user.email);

    const { tmnCode, hashSecret } = user.services.vnpay;

    const result = await VNPaySchema.TransactionStatusRequestInputSchema.strict().safeParseAsync(body);
    if (!result.success) throw new ValidateError("getPaymentLink", result.error.errors);

    const params = {
        ...result.data,
        vnp_Version: VNPAY_VERSION,
        vnp_Command: VNPAY_COMMAND.QUERYDR,
        vnp_TmnCode: tmnCode,
    } as Omit<IVNPay.TransactionStatusRequest, "vnp_SecureHash">;

    const rawSignature = [
        params.vnp_RequestId,
        params.vnp_Version,
        params.vnp_Command,
        tmnCode,
        params.vnp_TxnRef,
        params.vnp_TransactionDate,
        params.vnp_CreateDate,
        params.vnp_IpAddr,
        params.vnp_OrderInfo,
    ]
        .map(String)
        .join("|")
        .replace(/undefined/g, "");
    const signature = generateSignature(hashSecret, rawSignature, "vnpay");

    const url = `${VNPAY_URL}/merchant_webapi/api/transaction`;
    const response = await axios
        .post<IVNPay.TransactionStatusResponse>(
            url,
            { ...params, vnp_SecureHash: signature },
            {
                headers: { "Content-Type": "application/json" },
            }
        )
        .then((res) => VNPayResultHandler.resultHandler(res.status, res.data))
        .catch((err) => {
            if (isAxiosError<IVNPay.TransactionStatusResponse>(err) && err.response)
                return VNPayResultHandler.resultHandler(err.response.status, err.response.data);
            throw err;
        });

    return response;
}
