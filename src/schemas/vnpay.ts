import { z } from "zod";
import { IVNPay } from "../interfaces/bankingServices";

const formatVNPayDateUTC7 = (date: Date): number => {
    const tzOffsetMs = 7 * 60 * 60 * 1000;
    const localDate = new Date(date.getTime() + tzOffsetMs);
    return parseInt(localDate.toISOString().replace(/[-:T]/g, "").slice(0, 14));
};

export const BankCodeSchema = z.nativeEnum(IVNPay.VNPAY_BANK_CODE_REQUEST);

/** Refer to: **{@link IVNPay.PaymentLinkRequestInput IVNPay.PaymentLinkRequestInput}** */
export const PaymentLinkRequestInputSchema = z.object({
    vnp_Amount: z
        .number()
        .min(1000)
        .transform((val) => val * 100),
    vnp_BankCode: BankCodeSchema.or(z.string()).optional(),
    vnp_IpAddr: z.string().ip({ version: "v4" }),
    vnp_OrderInfo: z.string().regex(/^[a-zA-Z0-9\s]+$/),
    vnp_ReturnUrl: z.string().url(),
    vnp_ExpireDate: z
        .number()
        .int()
        .transform((val) => formatVNPayDateUTC7(new Date(val))),
    vnp_TxnRef: z.string(),
    vnp_CreateDate: z
        .date()
        .default(() => new Date())
        .transform(formatVNPayDateUTC7),
});

/** Refer to: **{@link IVNPay.TransactionStatusRequestInput IVNPay.TransactionStatusRequestInput}** */
export const TransactionStatusRequestInputSchema = z.object({
    vnp_RequestId: z.string(),
    vnp_TxnRef: z.string(),
    vnp_OrderInfo: z.string().regex(/^[a-zA-Z0-9\s]+$/),
    vnp_TransactionNo: z.number().int().optional(),
    vnp_IpAddr: z.string().ip({ version: "v4" }),
    vnp_TransactionDate: z
        .number()
        .int()
        .transform((val) => formatVNPayDateUTC7(new Date(val))),
    vnp_CreateDate: z
        .date()
        .default(() => new Date())
        .transform(formatVNPayDateUTC7),
});
