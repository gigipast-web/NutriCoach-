import fs from "fs";

const code = fs.readFileSync("/tmp/target_app.js", "utf-8");

// Find all components defined like `const ab=`, `const nb=`, etc.
const compRegex = /const\s+([a-zA-Z0-9_]+)\s*=\s*\(\{([^}]+)\}\)\s*=>\s*\{/g;
let match;
while ((match = compRegex.exec(code)) !== null) {
  const name = match[1];
  const props = match[2];
  const idx = match.index;
  console.log(`Found component: ${name} (props: ${props.replace(/\s+/g, " ")}) at index ${idx}`);
}
