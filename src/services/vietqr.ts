import axios from "axios";
import { VIETQR_URL } from "../constants.js";
import { VietQRSchema } from "../schemas/index.js";

import ValidateError from "../errors/validateError.js";
import ServiceUnknownResponseError from "../errors/serviceUnknownResponseError.js";

import type { IVietQR } from "../interfaces/bankingServices/index.js";

export async function getQRCode(body: IVietQR.GenerateQRCodeRequest): Promise<IVietQR.GenerateQRCodeResponse> {
    const test = await VietQRSchema.GetQrCodeRequestSchema.strict().safeParseAsync(body);
    if (!test.success) throw new ValidateError("getQRCode", test.error.errors);

    body = test.data;

    const res = await axios
        .post<IVietQR.ResponseVietQR<IVietQR.GenerateQRCodeResponse>>(`${VIETQR_URL}/generate`, body)
        .then((res) => res.data);

    if (!res.data) throw new ServiceUnknownResponseError("VietQR", "getQRCode", res.desc);

    return res.data;
}

export async function getBanks(): Promise<IVietQR.Bank[]> {
    return axios
        .get<IVietQR.ResponseVietQR<IVietQR.Bank[]>>(`${VIETQR_URL}/banks`)
        .then((res) => res.data)
        .then((res) => res.data);
}
