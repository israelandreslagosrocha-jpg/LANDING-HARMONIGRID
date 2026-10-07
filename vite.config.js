import { defineConfig } from "vite";
import { readFileSync } from "node:fs";
const previewHeaders = Object.fromEntries(
  JSON.parse(
    readFileSync(new URL("./vercel.json", import.meta.url)),
  ).headers[0].headers.map(({ key, value }) => [key, value]),
);
export default defineConfig({
  server: { host: "127.0.0.1", port: 3000, strictPort: true, open: false },
  preview: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: true,
    headers: previewHeaders,
  },
  build: { outDir: "dist", minify: true, sourcemap: false },
});
