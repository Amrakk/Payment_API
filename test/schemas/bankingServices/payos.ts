import { z } from "zod";
import { IPayOS } from "../../../src/interfaces/bankingServices";

/** Refer to: **{@link IPayOS.PAYMENT_STATUS IPayOS.PAYMENT_STATUS}** */
export const PaymentStatus = z.nativeEnum(IPayOS.PAYMENT_STATUS);

/** Refer to: **{@link IPayOS.Transaction IPayOS.Transaction}** */
export const Transaction = z.object({
    amount: z.number().min(0.01).max(10000000000),
    description: z.string(),
    accountNumber: z.string(),
    reference: z.string().optional(),
    transactionDateTime: z.string().optional(),
    counterAccountBankId: z.string().nullable(),
    counterAccountBankName: z.string().nullable(),
    counterAccountName: z.string().nullable(),
    counterAccountNumber: z.string().nullable(),
    virtualAccountName: z.string().nullable(),
    virtualAccountNumber: z.string().nullable(),
});

/** Refer to: **{@link IPayOS.PaymentLinkResponseData IPayOS.PaymentLinkResponseData}** */
export const PaymentLinkResponseData = z.object({
    ...Transaction.pick({ amount: true, accountNumber: true, description: true }).shape,
    bin: z.string(),
    accountName: z.string(),
    orderCode: z.number().int().min(0).max(9007199254740991),
    currency: z.string(),
    paymentLinkId: z.string().nullable(),
    status: PaymentStatus,
    checkoutUrl: z.string().url(),
    qrCode: z.string(),
});

/** Refer to: **{@link IPayOS.TransactionStatusResponseData IPayOS.TransactionStatusResponseData}** */
export const TransactionStatusResponseData = z.object({
    id: z.string(),
    orderCode: z.number().int().min(0).max(9007199254740991),
    amount: z.number().min(0.01).max(10000000000),
    amountPaid: z.number().min(0).max(10000000000),
    amountRemaining: z.number().min(0).max(10000000000),
    status: PaymentStatus,
    createdAt: z
        .string()
        .refine((v) => !isNaN(Date.parse(v)), { message: "Invalid date string" })
        .transform((v) => new Date(v)),
    transactions: z.array(Transaction).nullable(),
    canceledAt: z
        .string()
        .refine((v) => !isNaN(Date.parse(v)), { message: "Invalid date string" })
        .transform((v) => new Date(v))
        .nullable(),
    cancellationReason: z.string().nullable(),
});

/** Refer to: **{@link IPayOS.ResponsePayOS IPayOS.ResponsePayOS}** */
export const ResponsePayOS = (type: "paymentLink" | "transactionStatus") =>
    z
        .object({
            code: z.string(),
            desc: z.string(),
            data:
                type === "paymentLink"
                    ? PaymentLinkResponseData
                    : type === "transactionStatus"
                    ? TransactionStatusResponseData
                    : z.unknown(),
            signature: z.string(),
        })
        .strict();
