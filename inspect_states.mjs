import fs from "fs";

const s = fs.readFileSync("./extracted_initial_states.js", "utf-8");
console.log("Size:", s.length);
console.log("Start:\n", s.slice(0, 1000));
console.log("End:\n", s.slice(-1000));
