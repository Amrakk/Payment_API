import { z } from "zod";
import type { IVietQR } from "../../../src/interfaces/bankingServices/index.js";

/** Refer to: **{@link IVietQR.Bank IVietQR.Bank}** */
export const Bank = z.object({
    id: z.number(),
    code: z.string(),
    bin: z.string(),
    name: z.string(),
    shortName: z.string(),
    logo: z.string().url(),
    transferSupported: z.number(),
    lookupSupported: z.number(),
    swift_code: z.string().nullable(),
});

/** Refer to: **{@link IVietQR.GenerateQRCodeResponse IVietQR.GenerateQRCodeResponse}** */
export const GenerateQRCodeResponse = z.object({
    acpId: z.number().optional(),
    accountName: z.string().optional(),
    qrCode: z.string(),
    qrDataURL: z.string().url(),
});

/** Refer to: **{@link IVietQR.ResponseVietQR IVietQR.ResponseVietQR}** */
export const VietQRResponse = (type: "banks" | "qrCode") =>
    z
        .object({
            code: z.string(),
            desc: z.string(),
            data: type === "banks" ? z.array(Bank) : type === "qrCode" ? GenerateQRCodeResponse : z.unknown(),
        })
        .strict();
