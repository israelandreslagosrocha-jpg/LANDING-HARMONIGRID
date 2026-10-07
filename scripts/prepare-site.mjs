import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
const html = await readFile("index.html", "utf8");
const inlineScripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
  .map((match) => match[1])
  .filter(Boolean);
const hashes = inlineScripts.map(
  (source) =>
    `'sha256-${createHash("sha256").update(source).digest("base64")}'`,
);
const csp = `default-src 'self'; script-src 'self' ${hashes.join(" ")}; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'none'; media-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests`;
const headers = {
  "Content-Security-Policy": csp,
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "Strict-Transport-Security": "max-age=86400",
};
await mkdir("public", { recursive: true });
await writeFile(
  "public/_headers",
  "/*\n" +
    Object.entries(headers)
      .map(([key, value]) => `  ${key}: ${value}`)
      .join("\n") +
    "\n\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n\n/*.html\n  Cache-Control: public, max-age=0, must-revalidate\n",
);
await writeFile(
  "vercel.json",
  JSON.stringify(
    {
      buildCommand: "npm run build",
      outputDirectory: "dist",
      headers: [
        {
          source: "/(.*)",
          headers: Object.entries(headers).map(([key, value]) => ({
            key,
            value,
          })),
        },
        {
          source: "/assets/(.*)",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable",
            },
          ],
        },
      ],
    },
    null,
    2,
  ) + "\n",
);
// Vite copies public HTML verbatim: make this independent of development CSS paths.
let privacy = await readFile("public/privacidad.html", "utf8");
privacy = privacy.replace(/href="\/css\/site.css"/, 'href="/legal.css"');
await writeFile("public/privacidad.html", privacy);
await writeFile("public/legal.css", await readFile("css/site.css", "utf8"));
console.log("Security headers and privacy stylesheet prepared.");
