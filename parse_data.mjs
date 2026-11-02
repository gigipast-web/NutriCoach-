import fs from "fs";

const raw = fs.readFileSync("./extracted_initial_states.js", "utf-8");

// Let's create a sandboxed execution or regex parser to extract variables:
// xb, hb, bb, gb, pb, yb, jb, vb
try {
  // We can wrap it in an eval in node to get actual JS objects
  // But let's check if there are undefined references in raw
  const cleaned = raw
    .replace(/new Date\(\)\.toISOString\(\)\.split\("T"\)\[0\]/g, '"2026-09-22"')
    .replace(/new Date\(\)\.toISOString\(\)/g, '"2026-09-22T08:00:00.000Z"');

  const fn = new Function(`
    ${cleaned}
    return { xb, hb, bb, gb, pb, yb, jb, vb };
  `);
  const data = fn();
  console.log("Successfully evaluated data!");
  console.log("User:", data.xb.name);
  console.log("Meals count:", data.hb.length);
  console.log("Water:", data.bb);
  console.log("Activities count:", data.gb.length);
  console.log("Weight entries count:", data.pb.length);
  console.log("Badges count:", data.yb.length);
  console.log("Reminders count:", data.jb.length);
  console.log("Recipes count:", data.vb.length);

  fs.mkdirSync("./src/data", { recursive: true });
  fs.writeFileSync("./src/data/defaultData.json", JSON.stringify(data, null, 2));
} catch (e) {
  console.error("Eval error:", e.message);
}
