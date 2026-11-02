import fs from "fs";

const code = fs.readFileSync("/tmp/target_app.js", "utf-8");

// Let's dump the components into a readable file
fs.writeFileSync("./bundle_sample.txt", code.slice(200000, 320000));
console.log("Written bundle sample slice");

// Let's find food database if any
const foodDbMatch = code.match(/\[\{id:"f1"[^;]+\]/);
if (foodDbMatch) {
  fs.writeFileSync("./extracted_foods.json", foodDbMatch[0]);
  console.log("Extracted foods length:", foodDbMatch[0].length);
}
