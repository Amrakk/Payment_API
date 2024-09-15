import { z } from "zod";
import { IPayOS } from "../interfaces/bankingServices/index.js";

/** Refer to: {@link IPayOS.Item IPayOS.Item} */
export const ItemSchema = z.object({
    productName: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0),
});

/** Refer to: {@link IPayOS.PaymentLinkRequest IPayOS.PaymentLinkRequest} */
export const PaymentLinkRequestSchema = z.object({
    orderCode: z.number(),
    amount: z.number().min(1000),
    description: z.string().max(9),
    buyerName: z.string().nullable().optional(),
    buyerEmail: z.string().email().nullable().optional(),
    buyerPhone: z.string().nullable().optional(),
    buyerAddress: z.string().nullable().optional(),
    items: z.array(ItemSchema).nullable().optional(),
    cancelUrl: z.string().url(),
    returnUrl: z.string().url(),
    expiredAt: z.number().int().nullable().optional(),
});

/** Refer to: {@link IPayOS.TransactionStatusRequest IPayOS.TransactionStatusRequest} */
export const TransactionStatusRequestSchema = z.object({
    id: z.union([z.string(), z.number()]),
});
