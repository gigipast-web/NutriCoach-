import fs from "fs";

const code = fs.readFileSync("/tmp/target_app.js", "utf-8");

const appIdx = code.indexOf("function Mb()");
console.log("App component starts at:", appIdx);
const appCode = code.substring(appIdx, Math.min(code.length, appIdx + 15000));
fs.writeFileSync("./extracted_app_component.js", appCode);
console.log("Written extracted_app_component.js");
