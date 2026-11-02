import fs from "fs";

const code = fs.readFileSync("/tmp/target_app.js", "utf-8");

// Search for calculateMetrics or formula function
const calcMatch = code.match(/function\s+sb\([^)]*\)\s*\{[^}]+\}/);
console.log("sb function (metrics calculation?):", calcMatch ? calcMatch[0] : "none");

// Let's find AI system instructions or prompt
const promptIdx = code.indexOf("nutritionniste");
if (promptIdx !== -1) {
  console.log("Coach system prompt context:", code.substring(promptIdx - 100, promptIdx + 400));
}

// Check initial state
const stateIdx = code.indexOf("initialState");
console.log("initialState idx:", stateIdx);

// Look for localStorage keys
const storageMatches = code.match(/localStorage\.(getItem|setItem)\(["'][^"']+["']/g);
console.log("localStorage usage:", storageMatches);
