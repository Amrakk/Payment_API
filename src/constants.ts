export const PORT = parseInt(process.env.PORT ?? "3000");
export const BASE_URL = process.env.BASE_URL ?? "/api/v1";
export const HOST = process.env.HOST ?? "http://localhost";
export const DB_PATH = process.env.DB_PATH ?? "data.enc";
export const ERROR_LOG_PATH = process.env.ERROR_LOG_PATH ?? "error.log";

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
