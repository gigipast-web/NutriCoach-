import fs from "fs";

const code = fs.readFileSync("/tmp/target_app.js", "utf-8");

const sbIdx = code.indexOf("function sb(");
console.log("sb function full:");
console.log(code.substring(sbIdx, sbIdx + 1200));

// Let's find default user object
const defaultUserIdx = code.indexOf('name:"Sophie Martin"');
if (defaultUserIdx === -1) {
  const userIdx = code.indexOf('nutricoach_user');
  console.log("nutricoach_user context:", code.substring(userIdx - 100, userIdx + 600));
} else {
  console.log("Default user:", code.substring(defaultUserIdx - 50, defaultUserIdx + 400));
}
