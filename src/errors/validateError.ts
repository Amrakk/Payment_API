import type { ZodIssue } from "zod";
import PaymentAPIError from "./paymentAPIError.js";

export default class ValidateError extends PaymentAPIError {
    errors: ZodIssue[];
    constructor(operation: string, errors: ZodIssue[]) {
        super(`Validation error in ${operation}`);
        this.errors = errors;
    }
}
