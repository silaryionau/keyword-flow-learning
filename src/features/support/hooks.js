/**
 * Multiple Before hooks are executed in the order that they were defined.
 * Multiple After hooks are executed in the reverse order that they were defined.
 */
const fs = require('fs');
const path = require('path');
const { Before, After, BeforeAll, AfterStep } = require('@cucumber/cucumber');
const { fileHelper, dataStoreHelper, reportHelper } = require('keywordflow-wdio-js-lib');
const cucumberUtils = require('./../../../cucumber-utils');

// Set Soft Assert = true to all scenarios
BeforeAll(async function () {
  if (process.env.SOFT_ASSERT === 'true') {
    this.enabledSoftAsserts = true;
  }
  cucumberUtils.cucumberSoftAssertEnabling();
});

BeforeAll(async function () {

  await browser.addLocatorStrategy('containingText', (obj, root) => {
    let { selector, searchText, shouldBeArray } = obj;
    if (searchText.indexOf('__REGEXP__') === 0) {
      const match = searchText.split('__REGEXP__')[1].match(/\/(.*)\/(.*)?/);
      searchText = new RegExp(match[1], match[2] || '');
    }
    const scope = root ? root : document
    let elements = scope.querySelectorAll(selector);
    let matches = [];
    for (let i = 0; i < elements.length; ++i) {
      let element = elements[i];
      let elementText = element.textContent || element.innerText || '';
      let elementMatches = searchText instanceof RegExp ?
        searchText.test(elementText) :
        elementText.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

      if (elementMatches) {
        matches.push(element);
      }
    }

    return shouldBeArray ? matches : matches[0];
  });
});


/**
 * Before hook to store in memory dir location with test data files for running Scenario
 */
Before(async function (scenario) {
  const featureFilePath = path.resolve(scenario.gherkinDocument.uri);
  const featureFileName = path.parse(featureFilePath).name.toLowerCase();
  const testDataDir = path.resolve(featureFilePath.match(/(.*)[/\\]/)[1] || '', featureFileName + '-data');

  dataStoreHelper.setData('testDataDir', testDataDir);
});

// hook to enable file download in headless mode for chrome browser
Before(async function () {
  if (browser.capabilities.browserName === 'chrome') {
    return browser.sendCommand('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: browser.config.params.downloadDir
    });
  }
});

/**
 * Before hook for validation if tag @soft_assert_enable is used in Scenario
 */
Before({ tags: '@soft_assert_enable' }, async function () {
  this.enabledSoftAsserts = true;

  return cucumberUtils.cucumberSoftAssertEnabling();
});

// Clean download directory if it exists and not empty
Before(async function () {
  const baseDir = browser.config.params.downloadDir;

  if (fs.existsSync(baseDir)) {
    return fileHelper.removeDirectory(baseDir);
  }
});

// hook to attach log messages to a report
After(async function (scenarioResult) {
  if (browser.config.params.DEVICE_TYPE === 'PC' && browser.capabilities.browserName === 'chrome') {
    if (scenarioResult.result.status === 'failed') {
      const logs = await browser.getLogs('browser');
      if (logs.length > 0) {
        const featureName = scenarioResult.pickle.name.replace(/\s|\/|\?|<|>|\\|:|\*|\||"/g, '_');
        const logsDir = path.join(process.cwd(), 'browserLogs');
        const consoleLogsFileName = `${featureName}${Date.now()}.json`;

        if (!fs.existsSync(logsDir)) {
          fs.mkdirSync(logsDir);
        }
        const logsOutput = logs.map(u => u.level + ': ' + u.message).join('\n') + `\nSee all console logs in build artifacts: ${consoleLogsFileName}`;
        const isJenkins = browser.config.params.env != 'LOCAL';
        reportHelper.attachBrowserConsoleLogs(logsOutput, isJenkins);

        fs.writeFileSync(path.join(logsDir, consoleLogsFileName), JSON.stringify(logs, null, 2), 'utf8');
      }
    }
  }
});

// attach Assert Exceptions to the failed steps in report
AfterStep(async function ({ pickleStep }) {
  let attachScreen = true;
  if (pickleStep.status !== 'PASSED') {
    if (pickleStep.message) {
      // do not attach screenshot if API step failed
      const skipScreenAttach = [
        'api-verification-step-definitions',
        'api-step-definitions'
      ];
      for (const stepDefinitionToExclude of skipScreenAttach) {
        if (pickleStep.message.includes(stepDefinitionToExclude)) {
          attachScreen = false;
        }
      }
    }
    // =======================================================
    if (attachScreen) {
      const screenShot = await browser.takeScreenshot();
      reportHelper.attachScreenShotToReport(screenShot, 'Failed Screenshot');
    }
    // return reportHelper.attachAssertException(result.error);
  }

  // hook to clear cookies
  After(async function () {
    try {
      await browser.cdp('Network', 'clearBrowserCookies')
    } catch {
      // eslint-disable-next-line no-console
      console.log('Failed to clear cookies via CDP protocol')
    } finally {
      await browser.deleteCookies()
    }
  });

})

