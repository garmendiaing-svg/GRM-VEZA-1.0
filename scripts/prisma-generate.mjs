import { spawnSync } from "node:child_process";

process.env.DATABASE_URL ||=
  "postgresql://demo:demo@localhost:5432/electrofit?schema=public";

const command = process.platform === "win32" ? "prisma.cmd" : "prisma";
const result = spawnSync(command, ["generate"], {
  env: process.env,
  shell: true,
  stdio: "inherit"
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
