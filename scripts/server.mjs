import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const port = Number(process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

async function exists(filePath) {
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile();
  } catch {
    return false;
  }
}

function resolvePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const clean = path.normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  let filePath = path.join(dist, clean);
  if (clean.endsWith(path.sep) || path.extname(clean) === "") {
    filePath = path.join(filePath, "index.html");
  }
  return filePath;
}

const server = http.createServer(async (req, res) => {
  const filePath = resolvePath(req.url || "/");
  const safe = filePath.startsWith(dist);
  const finalPath = safe && (await exists(filePath)) ? filePath : path.join(dist, "404.html");
  const status = finalPath.endsWith("404.html") && finalPath !== filePath ? 404 : 200;

  try {
    const body = await fs.readFile(finalPath);
    res.writeHead(status, {
      "Content-Type": types[path.extname(finalPath)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(body);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(`Server error: ${error.message}`);
  }
});

server.listen(port, () => {
  console.log(`ZORQ Studio redesign running at http://localhost:${port}/`);
});
