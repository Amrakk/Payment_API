import UnsupportedError from "../errors/unsupportedError.js";

// TODO: Implement getPayInfo() to extract data from html
export function getPayInfo(service: string, html: string) {
    html = html.replace(/\s+/g, " ").trim();
    if (service === "momo") {
    }

    throw new UnsupportedError(service, "getPayInfo");
}
