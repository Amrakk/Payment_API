import axios from "axios";
import { test, describe, expect } from "bun:test";
import { Response } from "../schemas/api/index.js";
import { BASE_URL, HOST, PORT } from "../constants.js";
import { VietQRResponse } from "../schemas/bankingServices/vietqr.js";
import { MomoResponseGetBanks } from "../schemas/bankingServices/momo.js";
import { RESPONSE_CODE, RESPONSE_MESSAGE } from "../../src/interfaces/api/index.js";

import type { z } from "zod";

const baseUrl = `${HOST}${PORT ? `:${PORT}` : ""}${BASE_URL}`;

describe("getBanks", () => {
    const map = new Map<string, z.ZodTypeAny>([
        ["momo", MomoResponseGetBanks],
        ["vietqr", VietQRResponse("banks").shape.data],
    ]);

    const cases = Array.from(map.keys());

    test.each(cases)("should return a list of banks using '%s' service", async (service) => {
        const schema = map.get(service);
        expect(schema).toBeDefined();

        const res = await axios.get(`${baseUrl}/banks?service=${service}`).then((res) => res.data);
        const result = await Response({ data: schema! }).safeParseAsync(res);

        expect(result.success).toBe(true);
    });

    test("should return a response with error using unsupported service", async () => {
        const res = await axios.get(`${baseUrl}/banks?service=unsupported`).catch((err) => err.response);
        const expected = {
            code: RESPONSE_CODE.SERVICE_NOT_FOUND,
            message: RESPONSE_MESSAGE.SERVICE_NOT_FOUND,
        };

        expect(res.status).toBe(409);
        expect(res.data).toStrictEqual(expected);
    });
});
