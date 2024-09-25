import { z } from "zod";
import type { IMomo } from "../../../src/interfaces/bankingServices/index.js";

/** Refer to: **{@link IMomo.Bank IMomo.Bank}** */
export const Bank = z
    .object({
        bin: z.string(),
        name: z.string(),
        shortName: z.string(),
        bankLogoUrl: z.string().url(),
        isVietQr: z.boolean(),

        isDisburse: z.boolean(),
        isNapas: z.boolean(),
    })
    .strict();

/** Refer to: **{@link IMomo.ResponseGetBanks IMomo.ResponseGetBanks}** */
export const MomoResponseGetBanks = z.record(z.string(), Bank);

export const MomoResponseBase = z.object({
    partnerCode: z.string(),
    orderId: z.string(),
    responseTime: z.number(),
    message: z.string(),
    resultCode: z.number(),
});
