import fs from "fs";

const code = fs.readFileSync("/tmp/target_app.js", "utf-8");

// Search for patterns like `ab=({` or `nb=({` or `ob=({` etc.
const matches = [...code.matchAll(/([a-zA-Z0-9_$]+)\s*=\s*\((?:\{[^}]*\}|[a-zA-Z0-9_$,\s]*)\)\s*=>/g)];
console.log("Arrow functions with destructuring or params:", matches.length);
for (const m of matches) {
  if (m[0].includes("isDarkMode") || m[0].includes("activeTab") || m[0].includes("user") || m[0].includes("meals") || m[0].includes("water") || m[0].includes("recipes") || m[0].includes("badges")) {
    console.log("Component:", m[1], m[0]);
  }
}
