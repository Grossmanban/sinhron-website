// Serves out/ the way GitHub Pages does: under NEXT_PUBLIC_BASE_PATH, index.html for folders,
// 404.html for anything missing. Usage: npm run serve [-- --port 4321]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { gzipSync } from "node:zlib";

const root = new URL("../out/", import.meta.url).pathname;
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "/sinhron-website";
const port = Number(process.argv[process.argv.indexOf("--port") + 1]) || 4321;
const types = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml",
};

async function tryFile(p) {
  try {
    const s = await stat(p);
    if (s.isDirectory()) return tryFile(join(p, "index.html"));
    return p;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  let url = decodeURIComponent((req.url ?? "/").split("?")[0]);
  if (url === "/" && base) return res.writeHead(302, { location: `${base}/` }).end();
  if (base && url.startsWith(base)) url = url.slice(base.length) || "/";
  const file = await tryFile(join(root, normalize(url)));
  if (!file) {
    res.writeHead(404, { "content-type": types[".html"] });
    return res.end(await readFile(join(root, "404.html")));
  }
  const body = await readFile(file);
  const type = types[extname(file)] ?? "application/octet-stream";
  // GitHub Pages compresses text; do the same so local Lighthouse numbers are comparable.
  if (/text|javascript|json|svg|xml/.test(type) && /gzip/.test(req.headers["accept-encoding"] ?? "")) {
    res.writeHead(200, { "content-type": type, "content-encoding": "gzip" });
    return res.end(gzipSync(body));
  }
  res.writeHead(200, { "content-type": type });
  res.end(body);
}).listen(port, "127.0.0.1", () => console.log(`http://127.0.0.1:${port}${base}/`));
