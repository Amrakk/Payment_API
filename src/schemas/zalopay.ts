import { z } from "zod";
import { IZaloPay } from "../interfaces/bankingServices";

export const PaymentMethodSchema = z.nativeEnum(IZaloPay.ZLP_PAYMENT_METHOD);

export const PaymentLinkEmbedDataSchema = z.preprocess(
    (val) => (typeof val === "string" ? JSON.parse(val || "{}") : val),
    z
        .object({
            preferred_payment_method: z.array(PaymentMethodSchema).optional(),
            redirecturl: z.string().optional(),
            columninfo: z.preprocess((val) => (val ? JSON.stringify(val) : ""), z.string()).optional(),
            promotioninfo: z.preprocess((val) => (val ? JSON.stringify(val) : ""), z.string()).optional(),
            zlppaymentid: z.string().optional(),
        })
        .strict()
        .default({})
        .refine(
            (obj) => {
                try {
                    return JSON.stringify(obj).length <= 1024;
                } catch {
                    return false;
                }
            },
            {
                message: "embed_data must not exceed 1024 characters when stringified.",
            }
        )
);

export const PaymentLinkRequestInputSchema = z.object({
    app_user: z.string().max(50),
    app_trans_id: z
        .string()
        .max(34)
        .transform((val) => `${new Date().toISOString().slice(0, 10).replace(/-/g, "").substring(2)}${val}`),
    app_time: z.number().default(() => Date.now()),
    expire_duration_seconds: z.number().int().min(300).max(2592000).optional(),
    amount: z.number().int().min(1000),
    item: z.preprocess((val) => (val ? JSON.stringify(val) : "[]"), z.string().max(2048)),
    description: z.string().max(256),
    embed_data: PaymentLinkEmbedDataSchema.transform((val) => JSON.stringify(val)),
    bank_code: z.string().max(20).optional(),
    device_info: z.string().max(256).optional(),
    sub_app_id: z.string().max(50).optional(),
    title: z.string().max(256).optional(),
    currency: z.string().optional(),
    phone: z.string().max(50).optional(),
    email: z.string().max(100).optional(),
    address: z.string().max(1024).optional(),
});

export const TransactionStatusRequestInputSchema = z
    .object({
        app_trans_id: z.string(),
    })
    .strict();
