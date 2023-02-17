/**
 * Here will be application specific verification step methods
 */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.use(require('chai-string'));
const expect = chai.expect;
const { Then, setDefaultTimeout } = require('@cucumber/cucumber');
const stringUtils = require('../../utils/string-util');


setDefaultTimeout(300 * 1000);

// verify intercepted requests
Then('User verifies intercepted {string} request is success', async function (requestQuery) {
  await browser.resetExpectations();
  await browser.pause(3000); // wait a bit until request is finished
  let re = new RegExp(requestQuery);
  await browser.expectRequest('GET', re, 200); // expect requestQuery status code is 200

  return browser.assertExpectedRequestsOnly(); // validate the requests
});

// verify intercepted requests
Then('User verifies intercepted request {string} body is equal to json:', async function (requestQuery, expectedBody) {
  expectedBody = await stringUtils.replaceAllParamsInString(expectedBody);
  await browser.resetExpectations();
  await browser.pause(1000); // wait a bit until request is finished
  const requests = await browser.getRequests();
  const mainRequest = requests.find(req => req.url.includes(requestQuery));

  return expect((mainRequest.response.body)).to.deep.equal(JSON.parse(expectedBody));
});
