import fs from "fs";

const code = fs.readFileSync("/tmp/target_app.js", "utf-8");

const start = code.indexOf("const xb=");
const end = code.indexOf("function Mb()");
console.log("Chunk length:", end - start);
const stateDefs = code.substring(start, end);
fs.writeFileSync("./extracted_initial_states.js", stateDefs);
console.log("Saved extracted_initial_states.js");

// Now let's check how onSendMessage / Gemini API works in the bundle!
const geminiCallIdx = code.indexOf("generativelanguage.googleapis.com");
console.log("Gemini API direct URL check:", geminiCallIdx);

const coachIdx = code.indexOf("generateMenu");
console.log("generateMenu search:", coachIdx);
