const Validator = require('jsonschema').Validator;
const v = new Validator();
const schemaValidator = (response, schema) => {
  return v.validate(response, schema);
};

module.exports = { sV: schemaValidator};