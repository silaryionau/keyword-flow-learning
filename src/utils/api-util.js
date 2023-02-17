const chai = require('chai');
const expect = chai.expect;
const jsonPath = require('jsonpath');
const path = require('path');
const fs = require('fs');
const { diff } = require('deep-diff');
const { dataStoreHelper } = require('keywordflow-wdio-js-lib');

chai.config.truncateThreshold = 0;

/**
 * Used for taking necessary property from given Object
 *
 * @example
 * utils.objectParser(someObject, properties)
 *
 * @param object given object which should include parsing property
 * @param valueToParse object properties nesting by "."
 */
const objectParser = async (object, valueToParse) => {
  let finalProperty;

  const properties = valueToParse.split('.');

  properties.forEach(property => {
    try {
      if (!finalProperty) {
        return finalProperty = typeof object[property] === 'string' ? JSON.parse(object[property]) : object[property];
      }

      return finalProperty = finalProperty[property];

    } catch (e) {
      throw new Error(`There is no such properties: '${valueToParse}' in the '${object}'`);
    }
  });

  return finalProperty;
};

const getAllNodesFromJson = async (object) => {
  return jsonPath.nodes(object, '$..*');
};

const replaceValueInProperty = async (object, propertyPath, newValue) => {
  if (typeof propertyPath !== 'string') {
    propertyPath = jsonPath.stringify(propertyPath);
  }
  jsonPath.apply(object, propertyPath, function () {
    return newValue;
  });

  return object;
};

/**
 * Verifying that string are equals or one string contains another
 *
 * @example
 * utils.stringComparator(str1, str2, "equal to")
 *
 * @param givenText text that we will compare with "comparingText"
 * @param comparingText text for comparing with "givenText"
 * @param shouldBe String value that could be equal to "be equal to" or "contain" for comparing
 */
const stringComparator = async (givenText, comparingText, shouldBe) => {
  switch (shouldBe) {
    case 'equal to':
      return expect(givenText).to.equal(comparingText);
    case 'contain':
      return expect(givenText.includes(comparingText)).to.be.true;
    default:
      throw new Error(`Wrong ${shouldBe} was given.`);
  }
};

/**
 * Сonvert string to object or primitive
 *
 * @example
 * utils.stringComparator(str1, str2, "equal to")
 *
 * @param str string value that should be converted to object or primitive
 */
const parseValueFromString = async (str) => {
  if (str.startsWith('$')) {
    str = dataStoreHelper.getData(str.slice(1));
  } else {
    if (str.startsWith('"') && str.endsWith('"')) {
      str = str.slice(1, -1);
    } else if ((str.startsWith('[') && str.endsWith(']')) || (str.startsWith('{') && str.endsWith('}'))) {
      str = JSON.parse(str);
    } else if (str.match(/^-?\d*[.]?\d+$/)) {
      str = parseFloat(str);
    } else {
      switch (str) {
        case 'true':
          str = true;
          break;
        case 'false':
          str = false;
          break;
        case 'null':
          str = null;
          break;
      }
    }
  }

  return str;
};

/**
 * Construct query string
 * @param {Object} params
 * @return {string} - generated query string
 * @example
 * query([{
 *          query: "lastName",
 *          field: "Smith"
 * }]); //will return "?lastName=Smith"
 */
const query = async (params) => {
  let resultString = '?';

  params.forEach(paramQuery => {
    resultString += paramQuery.name + '=' + paramQuery.value + '&';
  });

  return resultString.slice(0, -1);
};

const addParameter = async (params, paramName, newValue) => {
  let newParams = params.slice();
  const newParam = {
    name: paramName,
    value: newValue
  };
  newParams.push(newParam);

  return newParams;
};

const getValueOfPropertyFromJson = async (object, jsonPathQuery) => {

  return jsonPath.value(object, jsonPathQuery);
};

const executeJsonPathQuery = async (object, jsonPathQuery) => {

  return jsonPath.query(object, jsonPathQuery);
};

const getDeepDiffErrMsg = async (deepDiffErr) => {
  if (typeof deepDiffErr === 'undefined' || deepDiffErr.length < 0) {
    return deepDiffErr;
  } else {
    const mapDeepDiffErrors = async (error) => {
      let errStr;
      switch (error['kind']) {
        case 'N':
          errStr = `[${error['path']}] property is not expected`;
          break;
        case 'D':
          errStr = `[${error['path']}] property is missing`;
          break;
        case 'E':
          errStr = `[${error['path']}] value is not equal to expected value. Actual: "${error['rhs']}". Expected: "${error['lhs']}"`;
          break;
        case 'A':
          errStr = `Property [${error['path']}] array is changed. Actual: "${error['rhs']}" is not equal to Expected: "${error['lhs']}"`;
          break;
      }

      return errStr;
    };

    const detailedDeepDiffErrors = deepDiffErr.map(async (err) => { return '\n' + (await mapDeepDiffErrors(err)); });

    return detailedDeepDiffErrors;
  }
};

const getFileDetailsForUpload = async (filename, dir = dataStoreHelper.getData('testDataDir')) => {
  const absolutePath = path.resolve(dir, filename);
  const attachment = {
    value: fs.createReadStream(absolutePath),
    options: {
      'filename': filename
    }
  };

  return attachment;
};

const replaceValuesFromDataTable = async (object, replacementDataTable) => {
  const replacementKeyValuePairs = replacementDataTable.raw();

  replacementKeyValuePairs.forEach(async (keyValuePair) => {
    const propertyPath = keyValuePair[0];
    const newPropertyValue = await parseValueFromString(keyValuePair[1]);

    await replaceValueInProperty(object, propertyPath, newPropertyValue);
  });

  return object;
};

const getAuthInfoFromUniqueMap = async () => {
  let authInfo = {
    headers: new Map(),
    jar: null
  };

  if (dataStoreHelper.getData('authInfo')) {
    authInfo = dataStoreHelper.getData('authInfo');
  }

  return authInfo;
};

/**
 * Verifying that values/objects are equals or value/object contains another
 *
 * @example
 * utils.dataComparator(obj, obj, "equal to")
 *
 * @param v1 value that we will compare with "v2" value
 * @param v2 value for comparing with ""v1" value
 * @param shouldBe String value that could be equal to "be equal to" or "contain" for comparing
 */
const dataComparator = async (v1, v2, shouldBe) => {
  switch (shouldBe) {
    case 'equal to':
      if (typeof v2 === 'object') {
        const diffRes = diff(v2, v1);

        return expect(v1, `${(await getDeepDiffErrMsg(diffRes))}`).to.deep.equal(v2);
      } else {
        return expect(v1).to.equal(v2);
      }
    case 'contain':
      if (typeof v2 === 'object') {
        return expect(v1).to.deep.include(v2);
      } else {
        return expect(v1.includes(v2)).to.be.true;
      }

    default:
      throw new Error(`Wrong ${shouldBe} was given.`);
  }
};



module.exports = {
  objectParser,
  stringComparator,
  dataComparator,
  query,
  addParameter,
  replaceValueInProperty,
  getAllNodesFromJson,
  getValueOfPropertyFromJson,
  getDeepDiffErrMsg,
  getFileDetailsForUpload,
  replaceValuesFromDataTable,
  parseValueFromString,
  getAuthInfoFromUniqueMap,
  executeJsonPathQuery
};