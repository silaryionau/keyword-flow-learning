const { defineParameterType } = require('@cucumber/cucumber');
const { stringHelper, dataStoreHelper } = require('keywordflow-wdio-js-lib');
const userData = require('../../data/user-data');
const page = require('../../data/pages-enum');
const fileDataHash = require('../../data/file-data-hash.js');
const jsonReader = require('../../utils/read-json-file-util').jR;
const path = require('path');
const stringUtils = require('../../utils/string-util');

/**
 * @STRING_REGEXP
 * Regular expression for reading value inside the double quotes
 * double quotes are excluded from result
 * will work in case string contains more than one value inside the double quotes
 *
 * Examples:
 *
 * Code field "#form-question-code" is displayed
 * Preview table ".form-question-preview" with text "Question preview" is displayed
 */
const STRING_REGEXP = /"([^"\\]*(\\.[^"\\]*)*)"/;

/**
 * Used for adding description to elements.
 */
defineParameterType({
  regexp: /[^"]*/,
  name: 'detail',
  useForSnippets: false
});

/**
 * Used for CSS locators.
 * Json-nesting can be any. It depends on project needs.
 * But first parameter should obligatory be page name from page-enum.js.
 * Last parameter should obligatory be element name.
 *
 * @return {string} css locator as it was passed
 * or take it from data folder.
 */
defineParameterType({
  regexp: STRING_REGEXP,
  name: 'locator',
  useForSnippets: true,
  transformer: (string) => {
    if (string.indexOf('|') !== -1) {
      const array = string.split('|');
      const pageName = array[0];
      const element = array[array.length - 1];
      let objectPath = page[pageName];

      for (let i = 1; i < array.length - 1; i++) {
        objectPath = objectPath[array[i]];
      }

      /*
      * Additional 'if' condition was added for checking if we are working with mobile 
      * or Desktop version and return valid selector with postfix "_Mobile" for mobile
      * version if it exist
      */
      if (browser.config.params.DEVICE_TYPE === 'mobile' && objectPath[`${element}_Mobile`]) {
        return objectPath[`${element}_Mobile`];
      }

      return objectPath[element];
    }

    return string;
  }
});

/**
 * Used for urls.
 * If string starts with 'http', will return string as it is.
 * Else will parse value and return it from user-data.js
 *
 * @return {string}
 */
defineParameterType({
  regexp: STRING_REGEXP,
  name: 'landing-url',
  useForSnippets: false,
  transformer: async (string) => {
    if (string.includes('$')) string = await stringUtils.replaceAllParamsInString(string);

    if (string.indexOf('http') === 0 || string.indexOf('/') === 0) {
      return string;
    }

    const environment = browser.config.params.env;
    // regexp to get values in format "{BASE_API_URL}/get"
    const regExp = /\{(.*?)\}((?<=}).*)/;
    const match = string.match(regExp);
    if (match !== null) {
      const baseApiName = match[1];
      const endPointPath = match[2];
      const baseApiUrl = userData.urls[baseApiName][environment];
      const endpoint = endPointPath ? baseApiUrl + endPointPath : baseApiUrl;

      return endpoint;
    }

    return userData.urls[string][environment];
  }
});

/**
 * Used for reading users from user-data.js
 */
defineParameterType({
  regexp: STRING_REGEXP,
  name: 'user',
  useForSnippets: false,
  transformer: (role) => {

    return userData.users[role];
  }
});

defineParameterType({
  regexp: STRING_REGEXP,
  name: 'map',
  useForSnippets: false,
  transformer: (string) => {
    return string.split('=');
  }
});

/**
 * Used for text values.
 * If string starts with "REGEXP:" - get string as regular expression.
 * If string starts with 'UNIQUE:' or 'UNIQUE-EMAIL:' - generate unique text value.
 * or read already generated unique value from global uniqueMap parameter.
 * If string starts with '$' - get value from global uniqueMap parameter
 * @return {string}
 */
defineParameterType({
  regexp: STRING_REGEXP,
  name: 'text',
  useForSnippets: true,
  transformer: (string) => {
    let result = string.replace(/\\"/g, '"');

    result = stringHelper.getUniqueTextIfNeeded(result);
    
    result = stringHelper.convertToRegexpIfNeeded(result);

    if (string.startsWith('$')) {
      result = global.uniqueMap[`${browser.sessionId}${string.slice(1)}`];
    }

    return result;
  }
});

/**
 * Used for hash values.
 * If string starts with 'HASH:' then value after ':' will be used for verification.
 * If HASH: is not set then hash should be defined in data/file-data-hash.js and name field should be provided
 * @return {string}
 */
defineParameterType({
  regexp: STRING_REGEXP,
  name: 'hash',
  useForSnippets: true,
  transformer: (hash) => {
    hash = hash.replace(/\\"/g, '"');
    if (hash.indexOf('HASH:') >= 0) {
      return hash.split('HASH:').pop();
    }

    return fileDataHash.hashes[hash];
  }
});

/**
 * Used for returning JSON 
 * 
 * If string ends with '.json' - parses the JSON file and returns JSON
 * If string starts with '$' - gets value from global uniqueMap parameter
 * If string starts with '{' or '['- parses the string and returns JSON
 * 
 * @example
 * File location:
 * feature file name: api-test.feature
 *     test data dir: api-test-data
 *         json-file: api-test-data\get-response-data.json
 * 
 * @return {JSON}
 */
defineParameterType({
  regexp: STRING_REGEXP,
  name: 'json',
  useForSnippets: false,
  transformer: (str) => {
    if (str.endsWith('.json')) {
      const testDataDir = dataStoreHelper.getData('testDataDir');

      return jsonReader(path.resolve(testDataDir, str));
    }

    if (str.startsWith('{') || str.startsWith('[')) {
      const jsonStr = str.replace(/\\"/g, '"');

      return JSON.parse(jsonStr);
    }

    if (str.startsWith('$')) {
      return global.uniqueMap[`${browser.sessionId}${str.slice(1)}`];
    }
  }
});

/**
 * Used for returning Form Data that should be used in request
 * Returns the Form Data from the specified file. File should be in the test data dir that starts with the same name as feature file + '-data'
 * 
 * @example
 * File location:
 * feature file name: api-test.feature
 *     test data dir: api-test-data
 *         json-file: api-test-data\post-formData.js
 * 
 * @return {formData}
 */
defineParameterType({
  regexp: STRING_REGEXP,
  name: 'formData',
  useForSnippets: false,
  transformer: (fileName) => {
    const testDataDir = dataStoreHelper.getData('testDataDir');
    const testFile = path.resolve(testDataDir, fileName);
    const formData = require(testFile).formData;

    return formData;
  }
});
