import fs from "fs";

// Let's create an overview of each file's key sections
for (const name of ["nb", "rb", "ob", "db", "fb", "mb", "Nb", "Sb", "wb", "Tb", "Ab"]) {
  const content = fs.readFileSync(`./dumped_comps/${name}.js`, "utf-8");
  console.log(`\n================== ${name}.js (${content.length} chars) ==================`);
  // Print first 500 chars and search for headers or card titles
  console.log(content.slice(0, 600));
}
