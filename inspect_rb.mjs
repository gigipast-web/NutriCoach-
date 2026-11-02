import fs from "fs";

const code = fs.readFileSync("./dumped_comps/rb.js", "utf-8");
console.log(code);
