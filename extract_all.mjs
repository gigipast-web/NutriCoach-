import fs from "fs";

const code = fs.readFileSync("/tmp/target_app.js", "utf-8");

// Let's find all tabs / navigation IDs
const tabsMatch = code.match(/\[\{id:"dashboard",label:[^\]]+\]/);
console.log("Navigation tabs:", tabsMatch ? tabsMatch[0] : "none");

// Let's find initial state or default constants
const matchRecipes = code.match(/\[\{id:"r1",title:[^;]+\]/);
if (matchRecipes) {
  fs.writeFileSync("./extracted_recipes.json", matchRecipes[0]);
  console.log("Extracted recipes length:", matchRecipes[0].length);
}

// Find badges
const matchBadges = code.match(/\[\{id:"b1"[^;]+\]/);
if (matchBadges) {
  fs.writeFileSync("./extracted_badges.json", matchBadges[0]);
  console.log("Extracted badges length:", matchBadges[0].length);
}

// Find user initial state
const matchUser = code.match(/\{name:"[^"]+",email:[^}]+targetCalories:[^}]+\}/);
if (matchUser) {
  console.log("Extracted user default:", matchUser[0]);
}

// Let's search for components
console.log("Searching for view components...");
const matches = code.match(/[a-zA-Z0-9_]+\s*=\s*\(\{[^}]*isDarkMode[^}]*\}\)\s*=>/g);
console.log("View components with isDarkMode:", matches);

// Let's find coach prompts or Gemini integration
const geminiIdx = code.indexOf("Gemini");
if (geminiIdx !== -1) {
  console.log("Gemini context:", code.substring(geminiIdx - 200, geminiIdx + 300));
}
