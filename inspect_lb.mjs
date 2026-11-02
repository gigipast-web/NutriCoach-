import fs from "fs";

const code = fs.readFileSync("./dumped_comps/lb.js", "utf-8");
console.log(code.slice(0, 5000));
