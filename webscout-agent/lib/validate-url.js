/**
 * URL validation for SSRF prevention: scheme whitelist, userinfo block,
 * private/metadata IP block, DNS rebinding defense, port allowlist.
 */

import { lookup } from "dns/promises";
import { isIP } from "net";

const ALLOWED_PORTS = new Set([80, 443]);
const MAX_URL_LENGTH = 2000;

// IPv4 blocked ranges: [start, end] in numeric form for comparison
function ipv4ToNum(parts) {
  if (parts.length !== 4) return null;
  let n = 0;
  for (let i = 0; i < 4; i++) {
    const p = parseInt(parts[i], 10);
    if (Number.isNaN(p) || p < 0 || p > 255) return null;
    n = (n << 8) | p;
  }
  return n >>> 0;
}

function parseIPv4(ip) {
  const parts = ip.trim().split(".");
  if (parts.length !== 4) return null;
  return ipv4ToNum(parts);
}

// Blocked IPv4 ranges (inclusive): [start, end]
const IPV4_BLOCKED = [
  [0, 0x00ffffff],           // 0.0.0.0/8
  [0x7f000000, 0x7fffffff],  // 127.0.0.0/8
  [0x0a000000, 0x0affffff], // 10.0.0.0/8
  [0xac100000, 0xac1fffff], // 172.16.0.0/12
  [0xc0a80000, 0xc0a8ffff], // 192.168.0.0/16
  [0xa9fe0000, 0xa9feffff], // 169.254.0.0/16 (link-local, metadata)
  [0x64400000, 0x647fffff], // 100.64.0.0/10 (Carrier-grade NAT)
  [0xc0000000, 0xc00000ff], // 192.0.0.0/24
  [0xc6120000, 0xc613ffff], // 198.18.0.0/15
];

// Specific metadata / cloud endpoints (numeric)
const IPV4_METADATA_BLOCKED = [
  parseIPv4("169.254.169.254"), // AWS
  parseIPv4("169.254.170.2"),   // ECS
  parseIPv4("100.100.100.200"), // Aliyun
].filter(Boolean);

/**
 * @param {string} ip - IPv4 address string
 * @returns {boolean}
 */
export function isBlockedIpv4(ip) {
  if (!ip || typeof ip !== "string") return true;
  const num = parseIPv4(ip);
  if (num === null) return true;
  for (const [start, end] of IPV4_BLOCKED) {
    if (num >= start && num <= end) return true;
  }
  if (IPV4_METADATA_BLOCKED.includes(num)) return true;
  return false;
}

/**
 * @param {string} ip - IPv6 address string (normalized or with brackets)
 * @returns {boolean}
 */
export function isBlockedIpv6(ip) {
  if (!ip || typeof ip !== "string") return true;
  const s = ip.replace(/^\[|\]$/g, "").toLowerCase();
  // ::1
  if (s === "::1" || s === "0:0:0:0:0:0:0:1") return true;
  // fc00::/7 (ULA)
  if (s.startsWith("fc") || s.startsWith("fd")) return true;
  // fe80::/10 (link-local)
  if (s.startsWith("fe8") || s.startsWith("fe9") || s.startsWith("fea") || s.startsWith("feb")) return true;
  // IPv4-mapped
  if (s.includes("ffff:")) {
    const last = s.split(":").pop();
    if (last && /^\d+\.\d+\.\d+\.\d+$/.test(last)) return isBlockedIpv4(last);
  }
  return false;
}

/**
 * @param {string} ip - IPv4 or IPv6
 * @returns {boolean}
 */
export function isPrivateIp(ip) {
  if (!ip || typeof ip !== "string") return true;
  const v = isIP(ip);
  if (v === 4) return isBlockedIpv4(ip);
  if (v === 6) return isBlockedIpv6(ip);
  return true;
}

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "[::1]",
  "metadata.google.internal",
]);

function hostnameLooksLikeBlocked(hostname) {
  if (!hostname || typeof hostname !== "string") return true;
  const h = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (BLOCKED_HOSTNAMES.has(h)) return true;
  if (h.endsWith(".local")) return true;
  // Numeric / variant IP notation: reject
  if (/^\d+$/.test(h)) return true; // integer form
  if (/^0x[0-9a-f]+$/i.test(h)) return true;
  if (/^0[0-7]+$/.test(h)) return true; // octal
  // IPv4 dotted
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(h)) {
    const num = parseIPv4(h);
    if (num !== null) return isBlockedIpv4(h);
  }
  // IPv6 in brackets
  if (h.startsWith("[") && h.endsWith("]")) {
    const inner = h.slice(1, -1);
    if (isIP(inner) === 6) return isBlockedIpv6(inner);
    return true;
  }
  return false;
}

/**
 * Validate port: only 80, 443 allowed (or default for scheme).
 * @param {string} port - URL port (can be '')
 * @param {string} scheme - 'http' or 'https'
 */
function isPortAllowed(port, scheme) {
  if (!port || port === "") return true; // default port
  const p = parseInt(port, 10);
  if (Number.isNaN(p) || p < 1 || p > 65535) return false;
  return ALLOWED_PORTS.has(p);
}

/**
 * Validate baseUrl for /api/collect: http/https only, no userinfo,
 * block private/metadata, DNS rebinding check, port 80/443 only.
 * @param {string} baseUrl
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function validateBaseUrl(baseUrl) {
  if (!baseUrl || typeof baseUrl !== "string") {
    return { ok: false, error: "Invalid base URL" };
  }
  const trimmed = baseUrl.trim();
  if (trimmed.length > MAX_URL_LENGTH) {
    return { ok: false, error: "Invalid base URL" };
  }
  if (trimmed.length === 0) return { ok: false, error: "Invalid base URL" };

  let url;
  try {
    url = new URL(trimmed);
  } catch {
    return { ok: false, error: "Invalid base URL" };
  }

  const scheme = url.protocol.replace(/:$/, "").toLowerCase();
  if (scheme !== "http" && scheme !== "https") {
    return { ok: false, error: "Invalid base URL" };
  }

  if (url.username || url.password) {
    return { ok: false, error: "Invalid base URL" };
  }

  const hostname = url.hostname;
  if (hostnameLooksLikeBlocked(hostname)) {
    return { ok: false, error: "Invalid base URL" };
  }

  if (!isPortAllowed(url.port, scheme)) {
    return { ok: false, error: "Invalid base URL" };
  }

  try {
    const addresses = await lookup(hostname, { all: true });
    for (const a of addresses) {
      const ip = a.address;
      if (isPrivateIp(ip)) {
        return { ok: false, error: "Invalid base URL" };
      }
    }
  } catch (err) {
    return { ok: false, error: "Invalid base URL" };
  }

  return { ok: true };
}

/**
 * Sync version for contexts where DNS is not needed (e.g. redirect URL with IP host).
 * Use for quick checks; for hostnames use async validateBaseUrl.
 * @param {string} baseUrl
 * @returns {{ ok: boolean, error?: string }}
 */
export function validateBaseUrlSync(baseUrl) {
  if (!baseUrl || typeof baseUrl !== "string") {
    return { ok: false, error: "Invalid base URL" };
  }
  const trimmed = baseUrl.trim();
  if (trimmed.length > MAX_URL_LENGTH || trimmed.length === 0) {
    return { ok: false, error: "Invalid base URL" };
  }
  let url;
  try {
    url = new URL(trimmed);
  } catch {
    return { ok: false, error: "Invalid base URL" };
  }
  const scheme = url.protocol.replace(/:$/, "").toLowerCase();
  if (scheme !== "http" && scheme !== "https") {
    return { ok: false, error: "Invalid base URL" };
  }
  if (url.username || url.password) {
    return { ok: false, error: "Invalid base URL" };
  }
  if (hostnameLooksLikeBlocked(url.hostname)) {
    return { ok: false, error: "Invalid base URL" };
  }
  if (!isPortAllowed(url.port, scheme)) {
    return { ok: false, error: "Invalid base URL" };
  }
  return { ok: true };
}

/**
 * Check if a URL string is safe for use in href (no javascript:, data:, etc.).
 * @returns {boolean}
 */
export function isSafeHref(urlStr) {
  if (!urlStr || typeof urlStr !== "string") return false;
  const s = urlStr.trim().toLowerCase();
  if (s.startsWith("javascript:") || s.startsWith("data:") || s.startsWith("vbscript:")) return false;
  if (s.startsWith("http://") || s.startsWith("https://")) return true;
  return false;
}
