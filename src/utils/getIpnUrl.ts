import { BASE_URL, HOST } from "../constants.js";

import UnsupportedError from "../errors/unsupportedError.js";

const supportedServices = ["momo", "payos"];

/** Return URL with format `HOST/payment_link_callback?service=<SERVICE>>&token=<CLIENT_ID>` */
export function getIpnUrl(service: string, clientId: string): string {
    if (!supportedServices.includes(service)) throw new UnsupportedError(service, "getIpnUrl");

    const url = new URL(`${HOST}${BASE_URL}/payment_link_callback`);
    url.searchParams.set("service", service);
    url.searchParams.set("token", clientId);

    return url.toString();
}
