import fs from "fs";

const code = fs.readFileSync("./dumped_comps/ob.js", "utf-8");
console.log(code.slice(5000));
