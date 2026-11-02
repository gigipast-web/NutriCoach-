import fs from "fs";

const code = fs.readFileSync("./dumped_comps/nb.js", "utf-8");
// print first 4000 characters
console.log(code.slice(0, 4000));
