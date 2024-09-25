import axios from "axios";
import { test, describe, expect } from "bun:test";
import { Response } from "../schemas/api/index.js";
import { BASE_URL, CLIENT_ID, HOST, PORT } from "../constants.js";
import { ResponsePayOS } from "../schemas/bankingServices/payos.js";
import { MomoResponseBase } from "../schemas/bankingServices/momo.js";
import { IMomo, IPayOS } from "../../src/interfaces/bankingServices/index.js";
import { RESPONSE_CODE, RESPONSE_MESSAGE } from "../../src/interfaces/api/response.js";

import type { z } from "zod";

type MapValueType = {
    [invalid: string]: { data: NonNullable<unknown>; expected?: object; schema?: z.ZodTypeAny };
    valid: { data: IMomo.TransactionStatusRequestInput | IPayOS.TransactionStatusRequest; schema: z.ZodTypeAny };
};
const baseUrl = `${HOST}${PORT ? `:${PORT}` : ""}${BASE_URL}`;

const map = new Map<string, MapValueType>([
    [
        "momo",
        {
            valid: {
                data: {
                    orderId: "1",
                    requestId: "test",
                    lang: IMomo.SUPPORTED_LANG.EN,
                },
                schema: MomoResponseBase,
            },
            empty: {
                data: {},
                expected: {
                    code: 8,
                    error: {
                        errors: [
                            {
                                code: "invalid_type",
                                expected: "string",
                                message: "Required",
                                path: ["orderId"],
                                received: "undefined",
                            },
                            {
                                code: "invalid_type",
                                expected: "string",
                                message: "Required",
                                path: ["requestId"],
                                received: "undefined",
                            },
                            {
                                code: "invalid_type",
                                expected: "'vi' | 'en'",
                                message: "Required",
                                path: ["lang"],
                                received: "undefined",
                            },
                        ],
                        name: "PaymentAPIError",
                        operation: "getPaymentLink",
                        statusCode: 400,
                    },
                    message: "Input validation failed! Please check your data",
                },
            },
        },
    ],
    [
        "payos",
        {
            valid: {
                data: {
                    id: "1",
                },
                schema: ResponsePayOS("transactionStatus").shape.data,
            },
            empty: {
                data: {},
                expected: {
                    code: 8,
                    message: "Input validation failed! Please check your data",
                    error: {
                        errors: [
                            {
                                code: "invalid_union",
                                message: "Invalid input",
                                path: ["id"],
                                unionErrors: [
                                    {
                                        issues: [
                                            {
                                                code: "invalid_type",
                                                expected: "string",
                                                message: "Required",
                                                path: ["id"],
                                                received: "undefined",
                                            },
                                        ],
                                        name: "ZodError",
                                    },
                                    {
                                        issues: [
                                            {
                                                code: "invalid_type",
                                                expected: "number",
                                                message: "Required",
                                                path: ["id"],
                                                received: "undefined",
                                            },
                                        ],
                                        name: "ZodError",
                                    },
                                ],
                            },
                        ],
                        name: "PaymentAPIError",
                        operation: "transactionStatus",
                        statusCode: 400,
                    },
                },
            },
        },
    ],
]);

const cases = Array.from(map.keys());

describe("transactionStatus", () => {
    describe.each(cases)("'%s' service", (service) => {
        const data = map.get(service);
        expect(data).toBeDefined();
        if (!data) return;

        const isWrongData = Object.keys(data).findIndex((key) => data[key].data === undefined);
        expect(isWrongData).toBe(-1);
        if (isWrongData !== -1) return;

        test(`should return a response with transaction status`, async () => {
            const valid = data.valid;
            expect(valid).toBeDefined();
            if (!valid) return;

            const res = await axios
                .post(`${baseUrl}/transaction_status?service=${service}`, valid.data, {
                    headers: {
                        "x-client-id": CLIENT_ID,
                    },
                })
                .then((res) => res.data);
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
                .post(`${baseUrl}/transaction_status?service=${service}`, empty.data, {
                    headers: {
                        "x-client-id": CLIENT_ID,
                    },
                })
                .catch((err) => err.response);

            expect(res.status).toBe(400);
            expect(res.data).toStrictEqual(expected);
        });
    });

    test("should return a response with error using unsupported service", async () => {
        const res = await axios
            .post(`${baseUrl}/transaction_status?service=unsupported`, undefined, {
                headers: {
                    "x-client-id": CLIENT_ID,
                },
            })
            .catch((err) => err.response);
        const expected = {
            code: RESPONSE_CODE.SERVICE_NOT_FOUND,
            message: RESPONSE_MESSAGE.SERVICE_NOT_FOUND,
        };

        expect(res.status).toBe(409);
        expect(res.data).toStrictEqual(expected);
    });

    test("should return a response with error when missing client id", async () => {
        const res = await axios.post(`${baseUrl}/transaction_status?service=momo`).catch((err) => err.response);
        const expected = {
            code: RESPONSE_CODE.UNAUTHORIZED,
            message: RESPONSE_MESSAGE.UNAUTHORIZED,
        };

        expect(res.status).toBe(401);
        expect(res.data).toStrictEqual(expected);
    });
});
