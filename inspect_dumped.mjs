import fs from "fs";

const files = ["ab.js", "nb.js", "rb.js", "ob.js", "db.js", "fb.js", "mb.js", "Nb.js", "Sb.js", "wb.js", "Tb.js", "Ab.js"];

for (const f of files) {
  const content = fs.readFileSync(`./dumped_comps/${f}`, "utf-8");
  console.log(`=== ${f} (${content.length} chars) ===`);
  // Look for text strings in French
  const frTexts = content.match(/"([^"]{4,50})"/g) || [];
  const sample = frTexts.filter(t => /[àéèêëîïôöùûüçA-Za-z\s]{5,}/.test(t) && !t.includes("class") && !t.includes("stroke") && !t.includes("border") && !t.includes("text-") && !t.includes("bg-") && !t.includes("rounded"));
  console.log("Sample texts:", sample.slice(0, 10).join(", "));
}
