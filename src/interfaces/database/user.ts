export interface User {
    /** User ID */
    id: string;
    /** User email */
    email: string;
    /** IPN URL */
    ipnUrl: string;
    /** Registered services */
    services: Services;
}

export interface Services {
    momo?: Momo;
    payos?: PayOS;
    vnpay?: VNPay;
    zalopay?: ZaloPay;
}

export interface PayOS {
    /** Payment gateway API key */
    apiKey: string;
    /** Payment gateway client ID */
    clientId: string;
    /** Payment gateway checksum key */
    checksumKey: string;
}

export interface Momo {
    /** Integration information */
    partnerCode: string;
    /** Server access key */
    accessKey: string;
    /** Used to create digital signature */
    secretKey: string;
    /** Used to encrypt data by RSA algorithm */
    publicKey: string | null;
}

export interface VNPay {
    /** Merchant code */
    tmnCode: string;
    /** Merchant secret key */
    hashSecret: string;
}

export interface ZaloPay {
    /** ZaloPay app ID */
    appid: number;
    /** ZaloPay key1 */
    key1: string;
    /** ZaloPay key2 */
    key2: string;
}
