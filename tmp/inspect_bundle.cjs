const fs = require("fs");
const code = fs.readFileSync("/tmp/target_app.js", "utf-8");

console.log("Length in chars:", code.length);

// Look for component names or major sections
const patterns = [
  /function\s+([A-Z][a-zA-Z0-9]+)/g,
  /const\s+([A-Z][a-zA-Z0-9]+)\s*=/g
];

const found = new Set();
for (const p of patterns) {
  let match;
  while ((match = p.exec(code)) !== null) {
    found.add(match[1]);
  }
}

console.log("Component/Identifier candidates:", Array.from(found).filter(s => 
  /View|Page|Tab|Modal|Card|Nav|Coach|Profile|Journal|Recipe|Weight|Water|Meal|Header|Footer|BMR|BMI|IMC/i.test(s)
));

// Find sample recipes or default data
const recipesMatch = code.match(/title:\s*["'][^"']+["'],\s*category/i);
console.log("Recipes sample match:", recipesMatch ? recipesMatch[0] : "none");

// Let's search for navigation items
const navMatch = code.match(/id:\s*["'](dashboard|journal|recipes|weight|coach|profile)[^}]*label:\s*["'][^"']+["']/g);
console.log("Nav items:", navMatch);

