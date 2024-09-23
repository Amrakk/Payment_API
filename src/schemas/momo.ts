import { z } from "zod";
import { IMomo } from "../interfaces/bankingServices/index.js";

/** Refer to: **{@link IMomo.SUPPORTED_LANG IMomo.SUPPORT_LANG}** */
export const SupportLangSchema = z.nativeEnum(IMomo.SUPPORTED_LANG);
/** Refer to: **{@link IMomo.REQUEST_TYPE IMomo.REQUEST_TYPE}** */
export const RequestTypeSchema = z.nativeEnum(IMomo.REQUEST_TYPE);

/** Refer to: **{@link IMomo.Item IMomo.Item}** */
export const ItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    category: z.string().optional(),
    imageUrl: z.string().optional(),
    manufacturer: z.string().optional(),
    price: z.number(),
    currency: z.string(),
    quantity: z.number().min(1),
    unit: z.string().optional(),
    totalPrice: z.number(),
    taxAmount: z.number().optional(),
});

/** Refer to: **{@link IMomo.UserInfo IMomo.UserInfo}** */
export const UserInfoSchema = z.object({
    name: z.string().optional(),
    phoneNumber: z.string().optional(),
    email: z.string().optional(),
});

/** Refer to: **{@link IMomo.PaymentLinkRequestInput IMomo.PaymentLinkRequestInput}** */
export const PaymentLinkRequestInputSchema = z.object({
    partnerName: z.string().optional(),
    storeId: z.string().optional(),
    requestId: z.string(),
    amount: z.number().min(1000).max(50000000),
    orderId: z.string().regex(/^[0-9a-zA-Z]([-_.]*[0-9a-zA-Z]+)*$/),
    orderInfo: z.string(),
    redirectUrl: z.string().url(),
    requestType: RequestTypeSchema,
    extraData: z.string(),
    items: z.array(ItemSchema).max(50).optional(),
    userInfo: UserInfoSchema.optional(),
    orderExpireTime: z.number().int().optional(),
    autoCapture: z.boolean().default(true),
    lang: SupportLangSchema,
});

/** Refer to: **{@link IMomo.TransactionStatusRequestInput IMomo.TransactionStatusRequestInput}** */
export const TransactionStatusRequestInputSchema = z.object({
    orderId: z.string().regex(/^[0-9a-zA-Z]([-_.]*[0-9a-zA-Z]+)*$/),
    requestId: z.string(),
    lang: SupportLangSchema,
});
