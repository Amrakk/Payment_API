import { z } from "zod";
import { RESPONSE_CODE, RESPONSE_MESSAGE } from "../../../src/interfaces/api/index.js";

import type { IResponse } from "../../../src/interfaces/api/index.js";

/** Refer to: {@link RESPONSE_CODE RESPONSE_CODE} */
export const ResponseCode = z.nativeEnum(RESPONSE_CODE);
/** Refer to: {@link RESPONSE_MESSAGE RESPONSE_MESSAGE} */
export const ResponseMessage = z.nativeEnum(RESPONSE_MESSAGE);

/** Refer to: {@link IResponse IResponse} */
export const Response = (schema?: { error: z.ZodTypeAny } | { data: z.ZodTypeAny }) =>
    z
        .object({
            code: ResponseCode,
            message: ResponseMessage,
            ...schema,
        })
        .strict();
