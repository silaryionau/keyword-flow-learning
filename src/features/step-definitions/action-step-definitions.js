/**
 * Here will be application specific action step methods.
 *
 * Next keywordflow-wdio-js-lib can be helpful, add them to project if needed:
 * fileHelper -> contains methods to work with files.
 * stringHelper -> contains methods to work with string.
 * endpointHelper -> contains methods to work with GET & POST requests.
 */
const fs = require("fs");
const { When, setDefaultTimeout } = require("@cucumber/cucumber");
const { elementHelper, dataStoreHelper } = require("keywordflow-wdio-js-lib");
const pageObjects = require("../../data/pages-enum");
const { getElement } = require("keywordflow-wdio-js-lib/helpers/element-helper");

setDefaultTimeout(300 * 1000);

/**
 * Execute login for specified user on specified URL.
 * User and url information is taken from user-data.js
 *
 * @example
 * User logs in as "ADMIN" on "PROJECT_NAME"
 *
 * Remove after reading: this method is presented as template
 * of usage keywordflow-wdio-js-lib and user-data.js.
 * Method should be changed with project needs.
 *
 * @param user should be named as in user-data.js
 * @param url should be named as in user-data.js
 */
When("User logs in as {user} on {landing-url}", async function (user, url) {
  const login = user.login;
  const password = user.password;

  await browser.url(url);

  const loginInput = await elementHelper.getElement(
    pageObjects.loginPage.loginInput
  );
  await loginInput.addValue(login);

  const passwordInput = await elementHelper.getElement(
    pageObjects.loginPage.passwordInput
  );
  await passwordInput.addValue(password);

  const loginButton = await elementHelper.getElement(
    pageObjects.loginPage.loginButton
  );

  return await loginButton.click();
});

// Need to call this step to start requests intercepting after any action
When("User starts itersepting API", async function () {
  return browser.setupInterceptor();
});

When(
  "User dragAndDrop {detail} {locator} to {detail} {locator} with execute script",
  async function (_, dragElement, __, destinationElement) {
    try {
      const dndScript = fs.readFileSync("./src/utils/dnd-util.js", "utf8");
      await browser.execute(
        dndScript +
          `$('${dragElement}').simulateDragDrop({ dropTarget: '${destinationElement}'});`
      );
    } catch (err) {
      console.error(err);
    }

    return;
  }
);

When("User remembers {string} as {text}", async (parameter, value) => {
  dataStoreHelper.setData(parameter, value);

  return;
});

When('Create new User with name {string}', async (username) => {
  let usernameEle = await elementHelper.getElement("input[data-ta=username]");
  let submitBtn = await elementHelper.getElement("input[data-ta=submit_username]");
  await usernameEle.addValue(username);
  await submitBtn.click();
});