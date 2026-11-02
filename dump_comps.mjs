import fs from "fs";

const code = fs.readFileSync("/tmp/target_app.js", "utf-8");

const comps = [
  { name: "ab", startStr: "ab=({activeTab:g,setActiveTab:D" },
  { name: "nb", startStr: "nb=({user:g,metrics:D" },
  { name: "rb", startStr: "rb=({meals:g,onAddMeal:D" },
  { name: "ob", startStr: "ob=({user:g,metrics:D,messages:E" },
  { name: "db", startStr: "db=({user:g,weightHistory:D" },
  { name: "fb", startStr: "fb=({user:g,water:D" },
  { name: "mb", startStr: "mb=({recipes:g,onAddMealFromRecipe:D" },
  { name: "Nb", startStr: "Nb=({badges:g,reminders:D" },
  { name: "Sb", startStr: "Sb=({user:g,metrics:D,onUpdateUser:E" },
  { name: "wb", startStr: "wb=({isOpen:g,onClose:D" },
  { name: "Tb", startStr: "Tb=({isOpen:g,onClose:D,onSelectFood:E" },
  { name: "Ab", startStr: "Ab=({isOpen:g,onClose:D,onSuccess:E" },
];

fs.mkdirSync("./dumped_comps", { recursive: true });

for (let i = 0; i < comps.length; i++) {
  const current = comps[i];
  const next = comps[i + 1];
  const start = code.indexOf(current.startStr);
  const end = next ? code.indexOf(next.startStr) : code.indexOf("function Mb()");
  if (start !== -1 && end !== -1) {
    const chunk = code.substring(start, end);
    fs.writeFileSync(`./dumped_comps/${current.name}.js`, chunk);
    console.log(`Saved ${current.name}.js (length ${chunk.length})`);
  } else {
    console.log(`Could not find boundary for ${current.name}`);
  }
}
