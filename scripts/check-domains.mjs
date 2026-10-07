/** Read-only launch check: HTTP 200 is insufficient if a domain is parked. */
const destinations = ["https://harmonigrid.com/", "https://harmonigrid.app/"];
let failed = false;
for (const url of destinations) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
    const html = await response.text();
    const title =
      html.match(/<title[^>]*>(.*?)<\/title>/is)?.[1] ?? "sin título";
    const parked = /parked domain|domain is parked|parking page/i.test(title);
    const branded = /harmonigrid/i.test(title);
    const ready = response.ok && !parked && branded;
    console.log(
      `${ready ? "PASS" : "FAIL"} ${url} → HTTP ${response.status} · ${title}`,
    );
    if (!ready) failed = true;
  } catch (error) {
    console.error(`FAIL ${url}: ${error.message}`);
    failed = true;
  }
}
process.exitCode = failed ? 1 : 0;
