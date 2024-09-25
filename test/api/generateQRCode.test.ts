import axios from "axios";
import { test, describe, expect } from "bun:test";
import { Response } from "../schemas/api/index.js";
import { BASE_URL, HOST, PORT } from "../constants.js";
import { VietQRResponse } from "../schemas/bankingServices/vietqr.js";
import { IVietQR } from "../../src/interfaces/bankingServices/index.js";
import { RESPONSE_CODE, RESPONSE_MESSAGE } from "../../src/interfaces/api/index.js";

import type { z } from "zod";

type MapValueType = {
    [invalid: string]: { data: NonNullable<unknown>; expected?: object; schema?: z.ZodTypeAny };
    valid: { data: IVietQR.GenerateQRCodeRequest; schema: z.ZodTypeAny };
};
const baseUrl = `${HOST}${PORT ? `:${PORT}` : ""}${BASE_URL}`;

const map = new Map<string, MapValueType>([
    [
        "vietqr",
        {
            valid: {
                data: {
                    accountName: "testing",
                    accountNo: "0123456789",
                    acqId: 970403,
                    template: IVietQR.TEMPLATE.COMPACT2,
                },
                schema: VietQRResponse("qrCode").shape.data,
            },
            empty: {
                data: {},
                expected: {
                    code: 8,
                    message: "Input validation failed! Please check your data",
                    error: {
                        errors: [
                            {
                                code: "invalid_type",
                                expected: "string",
                                message: "Required",
                                path: ["accountNo"],
                                received: "undefined",
                            },
                            {
                                code: "invalid_type",
                                expected: "string",
                                message: "Required",
                                path: ["accountName"],
                                received: "undefined",
                            },
                            {
                                code: "invalid_type",
                                expected: "number",
                                message: "Required",
                                path: ["acqId"],
                                received: "undefined",
                            },
                        ],
                        name: "PaymentAPIError",
                        operation: "getQRCode",
                        statusCode: 400,
                    },
                },
            },
            acqIdNotExist: {
                data: {
                    accountName: "testing",
                    accountNo: "0123456789",
                    acqId: 999999,
                    template: IVietQR.TEMPLATE.COMPACT2,
                },
                expected: {
                    code: 8,
                    message: "Input validation failed! Please check your data",
                    error: {
                        name: "PaymentAPIError",
                        operation: "getQRCode",
                        errors: [
                            {
                                code: "custom",
                                message: "acqId not exist",
                                path: ["acqId"],
                            },
                        ],
                        statusCode: 400,
                    },
                },
            },
        },
    ],
]);

const cases = Array.from(map.keys());

describe("generateQRCode", () => {
    describe.each(cases)("'%s' service", (service) => {
        const data = map.get(service);
        expect(data).toBeDefined();
        if (!data) return;

        const isWrongData = Object.keys(data).findIndex((key) => data[key].data === undefined);
        expect(isWrongData).toBe(-1);
        if (isWrongData !== -1) return;

        test(`should return a response with QR code data`, async () => {
            const valid = data.valid;
            expect(valid).toBeDefined();
            if (!valid) return;

            const res = await axios.post(`${baseUrl}/qr_code?service=${service}`, valid.data).then((res) => res.data);
            const result = await Response({ data: valid.schema }).safeParseAsync(res);

            expect(result.success).toBe(true);
        });

        test(`should return a response with error when using empty data`, async () => {
            const empty = data.empty;
            expect(empty).toBeDefined();
            if (!empty) return;

            const expected = empty.expected;
            expect(expected).toBeDefined();
            if (!expected) return;

            const res = await axios
                .post(`${baseUrl}/qr_code?service=${service}`, empty.data)
                .catch((err) => err.response);

            expect(res.status).toBe(400);
            expect(res.data).toStrictEqual(expected);
        });

        test(`should return a response with error when using non-existed 'acqId'`, async () => {
            const acqIdNotExist = data.acqIdNotExist;
            expect(acqIdNotExist).toBeDefined();
            if (!acqIdNotExist) return;

            const expected = acqIdNotExist.expected;
            expect(expected).toBeDefined();
            if (!expected) return;

            const res = await axios
                .post(`${baseUrl}/qr_code?service=${service}`, acqIdNotExist.data)
                .catch((err) => err.response);

            expect(res.status).toBe(400);
            expect(res.data).toStrictEqual(expected);
        });
    });

    test("should return a response with error using unsupported service", async () => {
        const res = await axios.post(`${baseUrl}/qr_code?service=unsupported`).catch((err) => err.response);
        const expected = {
            code: RESPONSE_CODE.SERVICE_NOT_FOUND,
            message: RESPONSE_MESSAGE.SERVICE_NOT_FOUND,
        };

        expect(res.status).toBe(409);
        expect(res.data).toStrictEqual(expected);
    });
});
