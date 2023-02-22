const { Then } = require('@cucumber/cucumber');
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
chai.config.truncateThreshold = 0;
const utils = require('../../utils/api-util');
const sv = require('../../utils/schema-validation-util').sV;
const { diff } = require('deep-diff');
const { dataStoreHelper } = require('keywordflow-wdio-js-lib');

/**
 * Comparing response status code with given
 *
 * @example
 * Status Code is "200"
 *
 * @param statusCode should be valid status code
 */
Then('Status Code is {text}', (statusCode) => {
  const response = dataStoreHelper.getData('response');

  expect(response.status).to.equal(parseInt(statusCode));
});

/**
 * Verifying that response contains all models
 *
 * @example
 * Response "body.data" contains:
 *       | _id                   |
 *       | appId                 |
 *       | serviceCategory       |
 *
 * @param responseElement response property nesting by "."
 * @param dataTable given data table with all properties
 */
Then('Response {text} contains:', async (responseElement, dataTable) => {
  const response = dataStoreHelper.getData('response');
  const property = await utils.objectParser(response, responseElement);

  if (Array.isArray(property) && property.length > 0) {
    property.forEach(data => {
      dataTable.rawTable.join().split(',').forEach(value => {
        expect(data).to.have.property(value);
      });
    });
  } else {
    dataTable.rawTable.join().split(',').forEach(value => {
      expect(property).to.have.property(value);
    });
  }
});

/**
 * Verifying that response model has necessary type
 *
 * @example
 * Response "body.data" is an "array"
 *
 * @param responseElement response property nesting by "."
 * @param type should be named as expected value type
 */
Then('Response {text} is a(n) {text}', async (responseElement, type) => {
  const response = dataStoreHelper.getData('response');
  const property = await utils.objectParser(response, responseElement);

  expect(property).to.be.an(type);
});

/**
 * Verify that array size is equal to|less than|greater than given number
 *
 * @example
 * Response "body.data" size is "greater than" "0"
 *
 * @param responseElement response property nesting by "."
 * @param action should be named as expected action (equal to|less than|greater)
 * @param expectedValue Number for comparing with array size
 */
Then('Response {text} size is {text} {text}', async (responseElement, action, expectedValue) => {
  const response = dataStoreHelper.getData('response');
  const count = await utils.objectParser(response, responseElement).length;

  switch (action) {
    case 'equal to':
      return expect(count).to.equal(parseInt(expectedValue));
    case 'less than':
      return expect(count).to.be.lessThan(parseInt(expectedValue));
    case 'greater than':
      return expect(count).to.be.greaterThan(parseInt(expectedValue));
    default:
      throw Error(`${action} is not defined`);
  }
});

/**
 * Verifying that every item in array or just one response model has necessary type
 *
 * @example
 * Response "every property" "_id" in "body.data" is a "String"
 *
 * @param every flag for checking array every value's or not
 * @param property response model property
 * @param responseElement response property nesting by "."
 * @param type should be named as expected value type
 */
Then('Response {text} {text} in {text} is a(n) {text}', async (every, property, responseElement, type) => {
  const response = dataStoreHelper.getData('response');
  const responseProperty = await utils.objectParser(response, responseElement);

  if (every.toLowerCase() === 'every property') {
    const errMsg = [];
    responseProperty.forEach((data, index) => {
      try {
        expect(data[property]).to.be.an(type);
      }
      catch (e) {
        errMsg.push(`\n[${index}]: ${e.message}`);
      }
    });
    assert(errMsg.length === 0, `${errMsg}`);
  } else {
    expect(responseProperty[property]).to.be.an(type);
  }
});

/**
 * Verifying that every item in array or just one response model is equal to given value
 *
 * @example
 * Response "property" "serviceCategory" in "body.data" is "equal to" "5afda076883f893c2c68ddc4"
 *
 * @param every flag for checking array value's or not
 * @param property response model property
 * @param responseElement response property nesting by "."
 * @param expected should be named as expected action (be equal to|contain)
 * @param value value for comparing with model property
 */
Then('Response {text} {text} in {text} is {text} {text}', async (every, property, responseElement, expected, value) => {
  const response = dataStoreHelper.getData('response');
  const responseProperty = await utils.objectParser(response, responseElement);
  if (typeof value === 'string') {
    value = await utils.parseValueFromString(value);
  }

  if (every.toLowerCase() === 'every property') {
    const errMsg = [];
    responseProperty.forEach(async (data, index) => {
      try {
        await utils.dataComparator(data[property], value, expected);
      }
      catch (e) {
        errMsg.push(`\n[${index}]: ${e.message}`);
      }
    });
    assert(errMsg.length === 0, `${errMsg}`);
  } else {
    try {
      await utils.dataComparator(responseProperty[property], value, expected);
    }
    catch (e) {
      assert(false, `${e.message}`);
    }
  }
});

/**
 * Execute any jsonPath query against response and verify result is equal to expected value
 *
 * @example
 * User verifies response with jsonPath "$..book[?(@.price==12.99)].title" result is equal to "Sword of Honour1"
 *
 * @param pathQuery jsonPath query
 * @param expectedValue value for comparing with result of jsonPath query
 * path query examples: https://www.npmjs.com/package/jsonpath
 */
Then('User verifies response with jsonPath {string} result is equal to {text}', async (pathQuery, expectedValue) => {
  const response = dataStoreHelper.getData('response');
  let result = await utils.executeJsonPathQuery(response, pathQuery);

  if (typeof expectedValue === 'string') {
    expectedValue = await utils.parseValueFromString(expectedValue);
  }

  if (result.length === 1) {
    result = result[0];
  }

  return expect(result).to.deep.equal(expectedValue);
});

/**
 * Execute any jsonPath query against response and verify result contains expected value
 *
 * @example
 * User verifies response with jsonPath "$..book[?(@.price==12.99)].title" result contains "Sword of Honour1"
 *
 * @param pathQuery jsonPath query
 * @param expectedValue value for comparing with result of jsonPath query
 * path query examples: https://www.npmjs.com/package/jsonpath
 */
Then('User verifies response with jsonPath {string} result contains {text}', async (pathQuery, expectedValue) => {
  const response = dataStoreHelper.getData('response');
  if (typeof expectedValue === 'string') {
    expectedValue = await utils.parseValueFromString(expectedValue);
  }

  return expect((await utils.executeJsonPathQuery(response, pathQuery))).to.contains(expectedValue);
});

/**
 * Execute any jsonPath query against response and verify result is not equal to expected value
 *
 * @example
 * User verifies response with jsonPath "$..book[?(@.price==12.99)].title" result is not equal to "Sword of Honour1"
 *
 * @param pathQuery jsonPath query
 * @param expectedValue value for comparing with result of jsonPath query
 * path query examples: https://www.npmjs.com/package/jsonpath
 */
Then('User verifies response with jsonPath {string} result is not equal to {text}', async (pathQuery, expectedValue) => {
  const response = dataStoreHelper.getData('response');
  let result = await utils.executeJsonPathQuery(response, pathQuery);

  if (typeof expectedValue === 'string') {
    expectedValue = await utils.parseValueFromString(expectedValue);
  }

  if (result.length === 1) {
    result = result[0];
  }

  return expect(result).to.not.deep.equal(expectedValue);
});

/**
 * Execute any jsonPath query against response and verify result does not contain expected value
 *
 * @example
 * User verifies response with jsonPath "$..book[?(@.price==12.99)].title" result does not contain "Sword of Honour1"
 *
 * @param pathQuery jsonPath query
 * @param expectedValue value for comparing with result of jsonPath query
 * path query examples: https://www.npmjs.com/package/jsonpath
 */
Then('User verifies response with jsonPath {string} result does not contain {text}', async (pathQuery, expectedValue) => {
  const response = dataStoreHelper.getData('response');
  if (typeof expectedValue === 'string') {
    expectedValue = await utils.parseValueFromString(expectedValue);
  }

  return expect((await utils.executeJsonPathQuery(response, pathQuery))).to.not.contains(expectedValue);
});

/**
 * Compare response property value with expected using jsonPath as finder
 *
 * @example
 * User verifies response contains property "_id" with value "123123123"
 *
 * @param propertyName any JSON property
 * @param expectedValue param name compare with actual property value found
 * path query examples: https://www.npmjs.com/package/jsonpath
 */
Then('User verifies response contains property {text} with value {text}', async (propertyName, expectedValue) => {
  const pathQuery = `$..[?(@.${propertyName}=='${expectedValue}')]`;
  const response = dataStoreHelper.getData('response');

  return expect((await utils.getValueOfPropertyFromJson(response, pathQuery)), `Response does not contain expected value: ${expectedValue}`).not.to.be.undefined;
});

/**
 * Verify response does not contain property with expected value using jsonPath as finder
 *
 * @example
 * User verifies response does not contain property "_id" with value "123123123"
 *
 * @param propertyName any JSON property
 * @param expectedValue param name compare with actual property value found
 * path query examples: https://www.npmjs.com/package/jsonpath
 */
Then('User verifies response does not contain property {text} with value {text}', async (propertyName, expectedValue) => {
  const pathQuery = `$..[?(@.${propertyName}=='${expectedValue}')]`;
  const response = dataStoreHelper.getData('response');

  return expect((await utils.getValueOfPropertyFromJson(response, pathQuery)), `Response contains value: ${expectedValue}`).to.be.undefined;
});

/**
 * Compare response property value with expected in the array of objects using jsonPath as finder
 *
 * @example
 * User verifies response contains property "title" in "body.data.store.book" with value "Sayings of the Century"
 * User verifies response contains property "author.id" in "body.data.store.book" with value "1"
 *
 * @param propertyName target property from the array of objects, can be nesting by "."
 * @param responseElement response Array property nesting by "."
 * @param expectedValue param name compare with actual property value found
 * path query examples: https://www.npmjs.com/package/jsonpath
 */
Then('User verifies response contains property {text} in {text} with value {text}', async (propertyName, responseElement, expectedValue) => {
  const pathQuery = `$..${responseElement}[?(@.${propertyName}=='${expectedValue}')]`;
  const response = dataStoreHelper.getData('response');

  return expect((await utils.getValueOfPropertyFromJson(response, pathQuery)), `Response does not expected value: ${expectedValue}`).not.to.be.undefined;
});

/**
 * Verify response does not contain property with expected value in the array of objects using jsonPath as finder
 *
 * @example
 * User verifies response does not contain property "author.name" in "body.data.store.book" with value "Test Rees"
 *
 * @param propertyName target property from the array of objects, can be nesting by "."
 * @param responseElement response Array property nesting by "."
 * @param expectedValue param name compare with actual property value found
 * path query examples: https://www.npmjs.com/package/jsonpath
 */
Then('User verifies response does not contain property {text} in {text} with value {text}', async (propertyName, responseElement, expectedValue) => {
  const pathQuery = `$.${responseElement}[?(@.${propertyName}=='${expectedValue}')]`;
  
  const response = dataStoreHelper.getData('response');

  return expect((await utils.getValueOfPropertyFromJson(response, pathQuery)), `Response contains value: ${expectedValue}`).to.be.undefined;
});

Then('User verifies response does not contain {string}', async (pathQuery) => {
  const response = dataStoreHelper.getData('response');
  const actualValue = await utils.getValueOfPropertyFromJson(response, pathQuery);

  return expect(actualValue, `Response contains: ${actualValue}`).to.be.undefined;
});

/**
 * Comparing response body with given json
 *
 * @example
 * Response body is equal to "get-response-data.json"
 *
 * File location:
 * feature file name: api-test.feature
 *     test data dir: api-test-data
 *         json-file: api-test-data\get-response-data.json
 * 
 * @param json should be json or fileName with expected json
 * 
 */
Then('Response body is equal to {json}', async (json) => {
  const response = dataStoreHelper.getData('response');
  const diffRes = diff(json, response.body);

  return expect(response.body, `Errors: ${(await utils.getDeepDiffErrMsg(diffRes))}\n`).to.deep.equal(json);
});

/**
 * Validate response body with given json-schema
 *
 * @example
 * Response body matches "get_articles_schema.json" schema
 *
 * File location:
 * feature file name: api-test.feature
 *     test data dir: api-test-data
 *         json-file: api-test-data\get-schema.json
 * 
 * @param schema should be json-shema or fileName with expected json-shema
 * 
 */
Then('Response body matches {json} schema', (schema) => {
  const response = dataStoreHelper.getData('response');
  const schemaValidationResult = sv(response.body, schema);
  let errMsg = [];
  if (schemaValidationResult.errors.length > 0) {
    errMsg = schemaValidationResult.errors.map(err => `\n${err.stack}`);
  }

  return assert(errMsg.length === 0, `Schema validation errors: ${errMsg}`);
});