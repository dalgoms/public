#!/usr/bin/env node
/**
 * Self-check for lib/validate-url.js (validateBaseUrl).
 * Run: node scripts/validate-url-selfcheck.mjs
 */

import { validateBaseUrl, validateBaseUrlSync, isBlockedIpv4, isBlockedIpv6, isPrivateIp } from "../lib/validate-url.js";

const tests = [
  { name: "allow https://example.com", url: "https://example.com", expectOk: true },
  { name: "allow http://example.com", url: "http://example.com", expectOk: true },
  { name: "block http://localhost", url: "http://localhost", expectOk: false },
  { name: "block http://127.0.0.1", url: "http://127.0.0.1", expectOk: false },
  { name: "block http://169.254.169.254", url: "http://169.254.169.254", expectOk: false },
  { name: "block http://[::1]", url: "http://[::1]", expectOk: false },
  { name: "block userinfo", url: "https://user:pass@example.com", expectOk: false },
  { name: "block javascript: scheme", url: "javascript:alert(1)", expectOk: false },
  { name: "block file: scheme", url: "file:///etc/passwd", expectOk: false },
  { name: "block non-80/443 port", url: "https://example.com:8080", expectOk: false },
  { name: "allow default https port", url: "https://example.com:443", expectOk: true },
  { name: "allow default http port", url: "http://example.com:80", expectOk: true },
  { name: "block 10.x", url: "http://10.0.0.1", expectOk: false },
  { name: "block 192.168.x", url: "http://192.168.1.1", expectOk: false },
  { name: "block empty", url: "", expectOk: false },
  { name: "block invalid URL", url: "not-a-url", expectOk: false },
];

async function run() {
  let passed = 0;
  let failed = 0;

  for (const t of tests) {
    const result = await validateBaseUrl(t.url);
    const ok = result.ok === t.expectOk;
    if (ok) {
      passed++;
      console.log(`PASS: ${t.name}`);
    } else {
      failed++;
      console.log(`FAIL: ${t.name} (expected ok=${t.expectOk}, got ok=${result.ok}${result.error ? `, error=${result.error}` : ""})`);
    }
  }

  // Sync checks (no DNS) for IP-based URLs
  const syncTests = [
    { name: "sync block 127.0.0.1", url: "http://127.0.0.1", expectOk: false },
    { name: "sync block localhost", url: "http://localhost", expectOk: false },
  ];
  for (const t of syncTests) {
    const result = validateBaseUrlSync(t.url);
    const ok = result.ok === t.expectOk;
    if (ok) {
      passed++;
      console.log(`PASS: ${t.name}`);
    } else {
      failed++;
      console.log(`FAIL: ${t.name}`);
    }
  }

  // Unit-style checks for isBlockedIpv4 / isBlockedIpv6
  if (isBlockedIpv4("127.0.0.1") && isBlockedIpv4("10.0.0.1") && !isBlockedIpv4("8.8.8.8")) {
    passed++;
    console.log("PASS: isBlockedIpv4");
  } else {
    failed++;
    console.log("FAIL: isBlockedIpv4");
  }
  if (isBlockedIpv6("::1") && isBlockedIpv6("fe80::1") && !isBlockedIpv6("2001:4860:4860::8888")) {
    passed++;
    console.log("PASS: isBlockedIpv6");
  } else {
    failed++;
    console.log("FAIL: isBlockedIpv6");
  }
  if (isPrivateIp("169.254.169.254") && !isPrivateIp("8.8.8.8")) {
    passed++;
    console.log("PASS: isPrivateIp");
  } else {
    failed++;
    console.log("FAIL: isPrivateIp");
  }

  console.log("\n---");
  console.log(`Total: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
