import PaymentAPIError from "./paymentAPIError.js";

export default class UnsupportedError extends PaymentAPIError {
    constructor(service: string, operation: string, email?: string) {
        if (email)
            super(
                `User with email '${email}' does not have the required information for the '${service}' service to perform the '${operation}' operation.`
            );
        else super(`The '${operation}' operation is not supported for the '${service}' service.`);
    }
}
