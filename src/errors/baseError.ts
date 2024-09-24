import type { IResponse } from "../interfaces/api/index.js";

export default abstract class BaseError extends Error {
    name = "PaymentAPIError";
    abstract statusCode: number;
    constructor(message?: string, options?: ErrorOptions) {
        super(message, options);
    }

    abstract getResponseBody(): IResponse;
}
