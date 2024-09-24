import { BASE_URL, HOST, PORT } from "../constants.js";

import UnsupportedError from "../errors/unsupportedError.js";

const supportedServices = ["momo", "payos"];

/** Return URL with format `HOST:PORT/payment_link_callback?service=<SERVICE>>&token=<CLIENT_ID>` */
export function getIpnUrl(service: string, clientId: string): string {
    if (!supportedServices.includes(service)) throw new UnsupportedError(service, "getIpnUrl");
    const host = HOST.includes("localhost") ? `${HOST}:${PORT}` : HOST;

    const url = new URL(`${host}${BASE_URL}/payment_link_callback`);
    url.searchParams.set("service", service);
    url.searchParams.set("token", clientId);

    return url.toString();
}
