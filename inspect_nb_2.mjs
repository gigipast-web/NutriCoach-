import fs from "fs";

const code = fs.readFileSync("./dumped_comps/nb.js", "utf-8");
console.log(code.slice(4000, 10000));
