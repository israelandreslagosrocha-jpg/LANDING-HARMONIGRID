import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
const html = await readFile("index.html", "utf8");

test("all section links resolve and only approved destinations are used", () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, "duplicate id");
  const links = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(
    (match) => match[1],
  );
  assert.ok(
    links.filter((url) => url === "https://harmonigrid.app/").length >= 4,
  );
  for (const url of links) {
    if (url.startsWith("#")) {
      assert.notEqual(url, "#", "placeholder link");
      assert.ok(ids.includes(url.slice(1)), `missing target ${url}`);
    } else if (url.startsWith("https://")) {
      assert.ok(
        ["harmonigrid.app", "www.instagram.com"].includes(
          new URL(url).hostname,
        ),
        `unexpected destination ${url}`,
      );
    } else assert.equal(url, "/privacidad.html");
  }
});
test("no fake collection, executable inline code or unsupported social proof", async () => {
  assert.doesNotMatch(
    html,
    /<form\b|\son\w+\s*=|style\s*=|2[,.]500|14 días gratis|\$8/,
  );
  const scripts = await Promise.all(
    ["js/app.js", "js/audio.js"].map((path) => readFile(path, "utf8")),
  );
  for (const script of scripts)
    assert.doesNotMatch(
      script,
      /localStorage|sessionStorage|innerHTML|eval\(|document\.cookie/,
    );
});
test("accessible landmarks, labelled demo and motion controls are present", async () => {
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
  assert.match(html, /class="skip-link" href="#contenido"/);
  assert.match(html, /aria-controls="mobile-menu"/);
  assert.match(html, /id="audio-status" role="status" aria-live="polite"/);
  assert.equal(
    [...html.matchAll(/class="chord-pad"[^>]*aria-label=/g)].length,
    4,
  );
  assert.match(
    await readFile("css/site.css", "utf8"),
    /prefers-reduced-motion/,
  );
});
test("production CSP permits exactly the structured data hash and blocks unwanted capabilities", async () => {
  const config = JSON.parse(await readFile("vercel.json", "utf8"));
  const headers = Object.fromEntries(
    config.headers[0].headers.map(({ key, value }) => [key, value]),
  );
  const csp = headers["Content-Security-Policy"];
  const structured = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
    .map((match) => match[1])
    .filter(Boolean);
  for (const source of structured)
    assert.ok(
      csp.includes(createHash("sha256").update(source).digest("base64")),
    );
  for (const directive of [
    "object-src 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'",
    "connect-src 'none'",
  ])
    assert.ok(csp.includes(directive));
  assert.doesNotMatch(csp, /unsafe-inline|unsafe-eval/);
  assert.equal(headers["X-Content-Type-Options"], "nosniff");
});
test("social image and local font exist within the asset budget", async () => {
  const png = await readFile("public/brand/social.png");
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
  assert.ok(png.length < 200_000);
  assert.ok((await stat("public/fonts/syne-700.ttf")).size < 60_000);
  assert.ok((await stat("public/brand/mark.svg")).size < 5_000);
});
test("privacy page has a real stylesheet and no dead resource links", async () => {
  const privacy = await readFile("public/privacidad.html", "utf8");
  assert.match(privacy, /href="\/legal.css"/);
  assert.ok((await stat("public/legal.css")).size > 0);
  assert.equal([...privacy.matchAll(/<h1\b/g)].length, 1);
});
