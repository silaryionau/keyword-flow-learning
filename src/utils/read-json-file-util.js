const fs = require('jsonfile');
const jsonReader = (json_path) => { 
  return fs.readFileSync(json_path);
};

module.exports = { jR: jsonReader};