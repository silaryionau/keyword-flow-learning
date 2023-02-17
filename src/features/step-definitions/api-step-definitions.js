const { Given, When } = require('@cucumber/cucumber');
const { endpointHelper, dataStoreHelper, reportHelper } = require('keywordflow-wdio-js-lib');
const utils = require('../../utils/api-util');
const stringUtils = require('../../utils/string-util');
const api_requests = require('../api-controllers/api-requests');

/**
 * Send request to the API
 *
 * @example
 * User sends "GET" request to "{BASE_API_URL}/articles"
 * 
 * @param method should be named as one of the http methods (e.g. GET, POST, PUT, DELETE and etc.)
 * @param serviceUri should be API endpoint
 */
When('User sends {text} request to {landing-url}', async (method, serviceUri) => {
  // attach request data to report
  reportHelper.attachRequestDataToReport(method, serviceUri);

  const authInfo = await utils.getAuthInfoFromUniqueMap();

  const response = await endpointHelper.sendRequest(method, serviceUri, null, authInfo.headers, authInfo.cookieJar);

  // attach response data to report
  reportHelper.attachResponseDataToReport(response);

  // store response to global.uniqueMap to be able to use it in next steps
  dataStoreHelper.setData('response', response);

  return response;
});

/**
 * Send request to the API with string query or any additional param in the request URI
 *
 * @example
 * User sends "GET" request to "{BASE_API_URL}/articles" with query "?category=HR&name=test"
 * User sends "GET" request to "{BASE_API_URL}/articles/" with Id "f37ce029-30d4-474b-a69b-a15dfe94bd05"
 * User sends "DELETE" request to "{BASE_API_URL}/articles/" with Id "f37ce029-30d4-474b-a69b-a15dfe94bd05"
 * 
 * @param method should be named as one of the http methods (e.g. GET, POST, PUT, DELETE and etc.)
 * @param serviceUri should be API endpoint
 * @param params any string query or value that will be added to the request URI
 */
Given('User sends {text} request to {landing-url} with query/Id {text}', async (method, serviceUri, params) => {
  serviceUri = `${serviceUri}${params}`;
  // attach request data to report
  reportHelper.attachRequestDataToReport(method, serviceUri);

  const authInfo = await utils.getAuthInfoFromUniqueMap();

  const response = await endpointHelper.sendRequest(method, serviceUri, null, authInfo.headers, authInfo.cookieJar);

  // attach response data to report
  reportHelper.attachResponseDataToReport(response);

  // store response to global.uniqueMap to be able to use it in next steps
  dataStoreHelper.setData('response', response);

  return response;
});

/**
 * Send request to the API with Body
 *
 * @example
 * User sends "POST" request to "{BASE_API_URL}/articles" with Body "article.json"
 * 
 * File location:
 * feature file name: api-test.feature
 *     test data dir: api-test-data
 *         json-file: api-test-data\article.json
 * 
 * @param method should be named as one of the http methods (e.g. GET, POST, PUT, DELETE and etc.)
 * @param serviceUri should be API endpoint
 * @param requestBody should be json
 */
Given('User sends {text} request to {landing-url} with Body {json}', async (method, serviceUri, requestBody) => {
  // attach request data to report
  reportHelper.attachRequestDataToReport(method, serviceUri, requestBody);

  const authInfo = await utils.getAuthInfoFromUniqueMap();
  authInfo.headers.set('Content-Type', 'application/json');

  const response = await endpointHelper.sendRequest(method, serviceUri, JSON.stringify(requestBody), authInfo.headers, authInfo.cookieJar);

  // attach response data to report
  reportHelper.attachResponseDataToReport(response);

  // store response to global.uniqueMap to be able to use it in next steps
  dataStoreHelper.setData('response', response);

  return response;
});

/**
 * Send request to the API with Form Data
 *
 * @example
 * User sends "POST" request to "{BASE_API_URL}/articles" with Form Data "article_fromData.js"
 * 
 * @param method should be named as one of the http methods (e.g. POST, PUT, PATCH and etc.)
 * @param serviceUri should be API endpoint
 * @param formData should be form data
 */
Given('User sends {text} request to {landing-url} with Form Data {formData}', async (method, serviceUri, formData) => {
  // attach request data to report
  reportHelper.attachRequestDataToReport(method, serviceUri, formData);

  const authInfo = await utils.getAuthInfoFromUniqueMap();
  const requestFormData = { 'formData': formData };

  const response = await endpointHelper.sendRequest(method, serviceUri, null, authInfo.headers, { ...requestFormData, ...authInfo.cookieJar });

  // attach response data to report
  reportHelper.attachResponseDataToReport(response);

  // store response to global.uniqueMap to be able to use it in next steps
  dataStoreHelper.setData('response', response);

  return response;
});

/**
 * Remembering model property in to the memory for future work
 *
 * @example
 * User remembers response property "_id" in "responseText.body.data"
 * or
 * User remembers response property "_id" in "responseText.data" as "yourParameterName"
 *
 * @param responseElement response property nesting by "."
 * @param property response model property
 */
When('User remembers response property {text} in {text} as {text}', async (property, responseElement, rememberAs) => {
  const response = dataStoreHelper.getData('response');
  const responseProperty = await utils.objectParser(response, responseElement);
  dataStoreHelper.setData(rememberAs, responseProperty[property]);
});

/**
 * Remembering model property in to the memory for future work using jsonPath as finder
 *
 * @example
 * User remembers response property "$.._id" as "yourParameterName"
 *
 * @param pathQuery json path query to find a property
 * @param rememberAs param name to store value fond by pathQuery
 * path query examples: https://www.npmjs.com/package/jsonpath
 */
When('User remembers response property {string} as {text}', async (pathQuery, rememberAs) => {
  const response = dataStoreHelper.getData('response');
  dataStoreHelper.setData(rememberAs, (await utils.getValueOfPropertyFromJson(response, pathQuery)));

  return;
});

/**
 * Send request to the API with Body passed as Cucumber Doc String
 *
 * @example
 * User sends "POST" request to "{BASE_API_URL}/articles" with Body:
 *     """
 *     {
 *       "title": "Test Post Request with Body passed as string"
 *     }
 *     """
 * 
 * @param method should be named as one of the http methods (e.g. GET, POST, PUT, DELETE and etc.)
 * @param serviceUri should be API endpoint
 * @param requestBody should be json passed as a Cucumber Doc String
 */
Given('User sends {text} request to {landing-url} with Body:', async (method, serviceUri, requestBody) => {
  // replace parameters in requestBody
  if (requestBody.includes('$')) requestBody = await stringUtils.replaceAllParamsInString(requestBody);

  requestBody = JSON.parse(requestBody);
  // attach request data to report
  reportHelper.attachRequestDataToReport(method, serviceUri, requestBody);

  const authInfo = await utils.getAuthInfoFromUniqueMap();
  authInfo.headers.set('Content-Type', 'application/json');

  const response = await endpointHelper.sendRequest(method, serviceUri, JSON.stringify(requestBody), authInfo.headers, authInfo.cookieJar);

  // attach response data to report
  reportHelper.attachResponseDataToReport(response);

  // store response to global.uniqueMap to be able to use it in next steps
  dataStoreHelper.setData('response', response);

  return response;
});

/**
 * //TODO replace step with general set HEADER step!!! 
 * Send request to the API with custom Content-Type and Body passed as Cucumber Doc String
 *
 * @example
 * User sends "POST" request to "{BASE_API_URL}/articles" with Content-Type "application/json" and Body:
 *     """
 *     {
 *       "title": "Test Post Request with Body passed as string"
 *     }
 *     """
 * 
 * @param method should be named as one of the http methods (e.g. GET, POST, PUT, DELETE and etc.)
 * @param serviceUri should be API endpoint
 * @param contentType should be content-type
 * @param requestBody request body should be passed as a Cucumber Doc String
 */
Given('User sends {text} request to {landing-url} with Content-Type {text} and Body:', async (method, serviceUri, contentType, requestBody) => {
  switch (contentType) {
    case 'application/json':
      requestBody = JSON.parse(requestBody);
      reportHelper.attachRequestDataToReport(method, serviceUri, requestBody);
      requestBody = JSON.stringify(requestBody);
      break;

    default:
      reportHelper.attachRequestDataToReport(method, serviceUri, requestBody, contentType);
      break;
  }

  const authInfo = await utils.getAuthInfoFromUniqueMap();
  authInfo.headers.set('Content-Type', contentType);

  const response = await endpointHelper.sendRequest(method, serviceUri, requestBody, authInfo.headers, authInfo.cookieJar);

  // attach response data to report
  reportHelper.attachResponseDataToReport(response);

  // store response to global.uniqueMap to be able to use it in next steps
  dataStoreHelper.setData('response', response);

  return response;
});

/**
 * Send request to the API with replaced values in Body
 *
 * @example
 * User sends "POST" request to "{BASE_API_URL}/articles" with Body "article.json" and replaced values:
 *     | title       | new_value             |
 *     | description | $value_from_uniqueMap |
 * 
 * File location:
 * feature file name: api-test.feature
 *     test data dir: api-test-data
 *         json-file: api-test-data\article.json
 * 
 * @param method should be named as one of the http methods (e.g. GET, POST, PUT, DELETE and etc.)
 * @param serviceUri should be API endpoint
 * @param requestBody should be json
 * @param replacementTable should be table with |key|value| pairs 
 */
Given('User sends {text} request to {landing-url} with Body {json} and replaced values:', async (method, serviceUri, requestBody, replacementTable) => {
  // perform replacements
  requestBody = await utils.replaceValuesFromDataTable(requestBody, replacementTable);

  // attach request data to report
  reportHelper.attachRequestDataToReport(method, serviceUri, requestBody);

  const authInfo = await utils.getAuthInfoFromUniqueMap();
  authInfo.headers.set('Content-Type', 'application/json');

  const response = await endpointHelper.sendRequest(method, serviceUri, JSON.stringify(requestBody), authInfo.headers, authInfo.cookieJar);

  // attach response data to report
  reportHelper.attachResponseDataToReport(response);

  // store response to global.uniqueMap to be able to use it in next steps
  dataStoreHelper.setData('response', response);

  return response;
});

/**
 * Send request to the API with replaced values in Form Data
 *
 * @example
 * User sends "POST" request to "{BASE_API_URL}/articles" with Form Data "article_fromData.js" and replaced values: 
 *     | title       | new_value             |
 *     | description | $value_from_uniqueMap |
 * 
 * @param method should be named as one of the http methods (e.g. POST, PUT, PATCH and etc.)
 * @param serviceUri should be API endpoint
 * @param formData should be form data
 * @param replacementTable should be table with |key|value| pairs 
 */
Given('User sends {text} request to {landing-url} with Form Data {formData} and replaced values:', async (method, serviceUri, formData, replacementTable) => {
  // perform replacements
  formData = await utils.replaceValuesFromDataTable(formData, replacementTable);

  // attach request data to report
  reportHelper.attachRequestDataToReport(method, serviceUri, formData);

  const authInfo = await utils.getAuthInfoFromUniqueMap();
  const requestFormData = { 'formData': formData };

  const response = await endpointHelper.sendRequest(method, serviceUri, null, authInfo.headers, { ...requestFormData, ...authInfo.cookieJar });

  // attach response data to report
  reportHelper.attachResponseDataToReport(response);

  // store response to global.uniqueMap to be able to use it in next steps
  dataStoreHelper.setData('response', response);

  return response;
});

/**
 * Login as specified user to perform API calls
 * 
 * @example
 * User "ADMIN" logs in with API
 * 
 * @param user user role from user-data.js
 */
Given('User {user} logs in with API', async function (user) {
  return api_requests.login(user);
});

/** 
* Send request to the API with Authorization Bearer
*
* @example
* User sets headers
*    | key           | value           |
     | ContentType   | application/json|
     | Authorization | Bearer token    |
*/

Given('User sets headers', async (dataTable) => {
  let authInfo = await utils.getAuthInfoFromUniqueMap();
  dataTable.hashes().forEach((header) => {
    if (header.value.includes('$')) {
      header.value = dataStoreHelper.getData(header.value.split('$')[1]);
    }
    authInfo.headers.set(header['key'], header.value);
  });

  // store response to global.uniqueMap to be able to use it in next steps
  dataStoreHelper.setData('authInfo', authInfo);

  return authInfo;
});
