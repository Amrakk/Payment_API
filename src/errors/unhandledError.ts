import PaymentAPIError from "./paymentAPIError.js";

export default class UnhandledError extends PaymentAPIError {
    description?: string;
    constructor(service: string, operation: string, description?: string) {
        super(
            `The '${operation}' operation for the '${service}' service returned an unexpected response from the API.`
        );
        this.description = description;
    }
}
