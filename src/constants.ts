// GENERAL
export const PORT = parseInt(process.env.PORT!);
export const BASE_URL = process.env.BASE_URL!;
export const HOST = process.env.HOST!;
export const DB_PATH = process.env.DB_PATH ?? "data.enc";

// LOG
export const LOG_FOLDER = process.env.LOG_FOLDER ?? "logs";
export const ERROR_LOG_FILE = process.env.ERROR_LOG_FILE ?? "error.log";
export const REQUEST_LOG_FILE = process.env.REQUEST_LOG_FILE ?? "request.log";

// ENCRYPTION
export const SECRET_KEY = process.env.SECRET_KEY!;
export const SECRET_IV = process.env.SECRET_IV!;
export const ENCRYPTION_METHOD = process.env.ENCRYPTION_METHOD!;

// MOMO
export const MOMO_URL = process.env.MOMO_URL!;

// VIETQR
export const VIETQR_URL = process.env.VIETQR_URL!;

// PAYOS
export const PAYOS_URL = process.env.PAYOS_URL!;

// VNPAY
export const VNPAY_URL = process.env.VNPAY_URL!;
export const VNPAY_VERSION = process.env.VNPAY_VERSION!;
