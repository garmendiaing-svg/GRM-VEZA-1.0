import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

process.env.DATABASE_URL ||=
  "postgresql://demo:demo@localhost:5432/electrofit?schema=public";

const here = dirname(fileURLToPath(import.meta.url));
const prismaCli = resolve(here, "../node_modules/prisma/build/index.js");
const result = spawnSync(process.execPath, [prismaCli, "generate"], {
  env: process.env,
  stdio: "inherit"
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
