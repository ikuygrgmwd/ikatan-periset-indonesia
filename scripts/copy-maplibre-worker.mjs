import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

// MapLibre v6's module worker imports a sibling chunk. Next/Turbopack must
// serve both unchanged from the same directory (see MapLibre installation guide).
const root = fileURLToPath(new URL("../", import.meta.url));
const dist = path.join(path.dirname(createRequire(import.meta.url).resolve("maplibre-gl/package.json")), "dist");
const destination = path.join(root, "public", "maplibre");
mkdirSync(destination, { recursive: true });
for (const filename of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) {
  copyFileSync(path.join(dist, filename), path.join(destination, filename));
}
