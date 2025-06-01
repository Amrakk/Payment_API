import axios from "axios";
import { VNPaySchema } from "../schemas";
import { generateSignature } from "../utils/encryption";
import { VNPAY_URL, VNPAY_VERSION } from "../constants";
import { objectToQueryString, sortObjectByKeys } from "../utils/objectHandlers";
import { SUPPORTED_LANG, VNPAY_COMMAND, VNPAY_CURRENCY, VNPAY_ORDER_TYPE } from "../interfaces/bankingServices/vnpay";

import ValidateError from "../errors/validateError";
import UnsupportedError from "../errors/unsupportedError";

import type { User } from "../interfaces/database/user";
import type { IVNPay } from "../interfaces/bankingServices/";

export async function getPaymentLink(body: IVNPay.PaymentLinkRequestInput & { vnp_IpAddr: string }, user: User) {
    const url = `${VNPAY_URL}/paymentv2/vpcpay.html`;
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
    });

    const rawSignature = objectToQueryString(params);
    const signature = generateSignature(hashSecret, rawSignature, "vnpay");

    const { vnp_Amount, vnp_CreateDate, vnp_ExpireDate, vnp_OrderInfo, vnp_TxnRef } = result.data;

    return {
        vnp_TxnRef,
        vnp_Amount,
        vnp_OrderInfo,
        vnp_ExpireDate,
        vnp_CreateDate,
        checkoutUrl: `${url}?${rawSignature}&vnp_SecureHash=${signature}`,
    } as IVNPay.PaymentLinkResponse;
}

export async function getBanks(tmnCode: string): Promise<IVNPay.Bank[]> {
    return axios
        .post<IVNPay.Bank[]>(
            `${VNPAY_URL}/qrpayauth/api/merchant/get_bank_list`,
            { tmn_code: tmnCode },
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then((res) => res.data);
}
