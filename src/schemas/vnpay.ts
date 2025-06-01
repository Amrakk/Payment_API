import { z } from "zod";
import { IVNPay } from "../interfaces/bankingServices";

const formatVNPayDateUTC7 = (date: Date): string => {
    const tzOffsetMs = 7 * 60 * 60 * 1000;
    const localDate = new Date(date.getTime() + tzOffsetMs);
    return localDate.toISOString().replace(/[-:T]/g, "").slice(0, 14);
};

export const BankCodeSchema = z.nativeEnum(IVNPay.BANK_CODE);

/** Refer to: **{@link IVNPay.PaymentLinkRequestInput IVNPay.PaymentLinkRequestInput}** */
export const PaymentLinkRequestInputSchema = z.object({
    vnp_Amount: z
        .number()
        .min(1000)
        .transform((val) => val * 100),
    vnp_BankCode: BankCodeSchema.optional(),
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
