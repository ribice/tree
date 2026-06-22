#!/usr/bin/env node
import { execFileSync } from "node:child_process";

const DATA_PATHS = ["src/content/people", "src/content/translations"];
const CHANGELOG = "src/lib/changelog.ts";

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

function changedFiles() {
  // Equivalent to: git diff --name-status -- src/content/people src/content/translations src/lib/changelog.ts
  const output = git(["diff", "--name-status", "--", ...DATA_PATHS, CHANGELOG]);
  if (!output) return [];
  return output.split("\n").map((line) => {
    const [status, ...rest] = line.split(/\s+/);
    return { status, path: rest.join(" ") };
  });
}

const changes = changedFiles();
const dataChanges = changes.filter((entry) =>
  DATA_PATHS.some((path) => entry.path.startsWith(`${path}/`)),
);
const changelogChanged = changes.some((entry) => entry.path === CHANGELOG);

if (!changes.length) {
  console.log("No uncommitted family-data or changelog changes detected.");
  process.exit(0);
}

if (dataChanges.length) {
  console.log("Family-data changes:");
  for (const entry of dataChanges) {
    console.log(`- ${entry.status.padEnd(2)} ${entry.path}`);
  }
  console.log("");
  if (changelogChanged) {
    console.log(`Changelog updated: ${CHANGELOG}`);
  } else {
    console.log(`Reminder: add a data summary to ${CHANGELOG} before pushing.`);
  }
} else if (changelogChanged) {
  console.log(`Only ${CHANGELOG} changed; no person or translation file changes detected.`);
}
