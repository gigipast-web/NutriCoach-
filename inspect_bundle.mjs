import fs from "fs";

// Read downloaded bundle
const code = fs.readFileSync("/tmp/target_app.js", "utf-8");
console.log("Bundle length:", code.length);

// Search for lucide icons used
const iconMatches = [...new Set(code.match(/[A-Z][a-zA-Z0-9]+(?=Icon|\$1)/g) || [])];
console.log("Icons found (sample):", iconMatches.slice(0, 20));

// Find string sections that define recipes, meals, coach, questions, tabs
const fsOut = [];

// Look for object literals with lots of keys
const sections = code.split(/function\s+/);
console.log("Function count:", sections.length);

// Let's write out formatted / pretty printed chunks or search keywords
const keywords = ["initialState", "recipes", "JOURNAL", "IMC", "BMR", "Coach", "gemini", "OPENAI", "calorie", "eau", "water", "repas"];
for (const kw of keywords) {
  let idx = 0;
  let count = 0;
  while ((idx = code.indexOf(kw, idx)) !== -1 && count < 3) {
    console.log(`--- Keyword: ${kw} at ${idx} ---`);
    console.log(code.substring(Math.max(0, idx - 100), Math.min(code.length, idx + 200)));
    idx += kw.length;
    count++;
  }
}
