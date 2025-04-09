const fs = require("fs");
const path = require("path")
const basename = path.basename(__filename);
const db = {};

const modelsDir = __dirname;

fs.readdirSync(modelsDir)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      !file.includes(".test.js")
  )
  .forEach((file) => {
    const model = require(path.join(modelsDir, file));
    db[model.modelName || path.basename(file, ".js")] = model; 
  });

module.exports = db;
