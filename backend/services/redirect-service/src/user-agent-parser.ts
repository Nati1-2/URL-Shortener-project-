import { UAParser } from "ua-parser-js";
import crypto from "crypto";

export function parseVisitorTelemetry(headers: Record<string, any>, ip: string = "127.0.0.1") {
  const userAgentStr = headers["user-agent"] || "";
  const parser = new UAParser(userAgentStr);
  const result = parser.getResult();

  const deviceType = result.device.type ? (result.device.type === "mobile" ? "Mobile" : result.device.type === "tablet" ? "Tablet" : "Desktop") : "Desktop";
  const browser = result.browser.name || "Chrome";
  const os = result.os.name || "macOS";

  // IP Hash for GDPR privacy compliance (never store plaintext IP in analytics)
  const ipHash = crypto.createHash("sha256").update(ip).digest("hex").substring(0, 16);

  // Deriving Geo information from headers (Cloudflare CF-IPCountry / header fallback)
  const countryCode = headers["cf-ipcountry"] || headers["x-country-code"] || "US";
  const countryMap: Record<string, string> = {
    US: "United States",
    GB: "United Kingdom",
    DE: "Germany",
    CA: "Canada",
    FR: "France",
    JP: "Japan",
    BR: "Brazil",
    AU: "Australia",
  };

  const country = countryMap[countryCode] || "United States";
  const referrer = headers["referer"] || headers["referrer"] || "Direct Traffic";

  return {
    ipHash,
    country,
    deviceType,
    browser,
    os,
    referrer,
    userAgent: userAgentStr,
  };
}
