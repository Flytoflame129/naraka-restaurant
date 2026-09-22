import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const result = spawnSync(
  "git",
  ["ls-files", "--cached", "--ignored", "--exclude-per-directory=.gitignore", "-z"],
  { cwd: root, encoding: "utf8", windowsHide: true },
);

if (result.error || result.status !== 0) {
  console.error("Repository validation requires Git and a readable repository checkout.");
  process.exitCode = 1;
} else {
  const trackedArtifacts = result.stdout.split("\0").filter(Boolean);
  if (trackedArtifacts.length > 0) {
    console.error("Ignored local artifacts are still tracked by Git:");
    for (const path of trackedArtifacts) console.error(`- ${path}`);
    console.error("Remove only the intended paths from the index with git rm --cached; keep local files.");
    process.exitCode = 1;
  } else {
    console.log("Repository validation passed: no tracked files match repository ignore rules.");
  }
}
