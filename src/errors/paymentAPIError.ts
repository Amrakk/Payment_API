export default class PaymentAPIError extends Error {
    name = "PaymentAPIError";
    constructor(message?: string, options?: ErrorOptions) {
        super(message, options);
    }
}
