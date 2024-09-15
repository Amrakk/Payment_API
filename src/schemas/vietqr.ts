import { z } from "zod";
import { IVietQR } from "../interfaces/bankingServices/index.js";

export const TemplateSchema = z.nativeEnum(IVietQR.TEMPLATE);

/** Refer to: **{@link IVietQR.GenerateQRCodeRequest IVietQR.GenerateQRCodeRequest}** */
export const GetQrCodeRequestSchema = z.object({
    accountNo: z.string(),
    accountName: z.string().min(5).max(50),
    acqId: z.number().refine((v) => `${v}`.length == 6, { message: "accId must be 6 digits" }),
    amount: z
        .number()
        .refine((v) => `${v}`.length <= 13, { message: "amount must be less than 13 digits" })
        .optional(),
    addInfo: z.string().max(25).optional(),
    template: TemplateSchema.default(IVietQR.TEMPLATE.COMPACT2),
});
