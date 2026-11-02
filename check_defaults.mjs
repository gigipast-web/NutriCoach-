import fs from "fs";

const code = fs.readFileSync("/tmp/target_app.js", "utf-8");

function printDef(name) {
  const idx = code.indexOf(`const ${name}=`);
  if (idx !== -1) {
    console.log(`=== const ${name} ===`);
    console.log(code.substring(idx, idx + 800));
  } else {
    console.log(`=== ${name} not found with 'const ${name}=' ===`);
  }
}

for (const n of ["xb", "hb", "bb", "gb", "pb", "yb"]) {
  printDef(n);
}

// Also let's find reminders default
const remIdx = code.indexOf("nutricoach_reminders");
console.log("Reminders context:", code.substring(remIdx, remIdx + 300));
