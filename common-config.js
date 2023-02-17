/* eslint-disable no-undef */
/* eslint-disable no-console */
const os = require('os');                   // this is the standard Node.js operating system API
const fs = require('fs');
const path = require('path');               // this is the standard Node.js filepath API
const yargs = require('yargs').argv;

const { generate } = require('multiple-cucumber-html-reporter');
const fileHelper = require('keywordflow-wdio-js-lib/helpers/file-helper');
const allureResultsPath = 'results';
const jsonResultsPath = 'reports';
const browserLogsPath = 'browserLogs';
const SAVE_INTERSESSIONAL_DATA = false;
const DOWNLOAD_FOLDER_NAME = 'download' + path.sep + new Date().getTime();
const downloadDir = `${os.homedir() + path.sep + DOWNLOAD_FOLDER_NAME}`;

const failedScreenshots_tempFileName = path.join(process.cwd(), 'failedScreenshots.txt');
const failedScreenshots_json = 'failedScreenshots.json';
const DELIMITER = '===DELIMITER===';
const SCREENSHOTS_DIRNAME = 'screenshots'; // relative to feature dir
const DEVICE_NAME = process.env.DEVICE_NAME ? process.env.DEVICE_NAME : (yargs.DEVICE_NAME || 'iPhone X'); // NOTE: PC here means personal computer (inc. Mac) rather than IBM-compatible PC
const DEVICE_TYPE = process.env.DEVICE_TYPE ? process.env.DEVICE_TYPE : (yargs.DEVICE_TYPE || 'PC'); // NOTE: PC here means personal computer (inc. Mac) rather than IBM-compatible PC
const ENVIRONMENT = process.env.TEST_ENV ? process.env.TEST_ENV : (yargs.TEST_ENV || 'LOCAL');
const BROWSER_NAME = process.env.BROWSER_NAME ? process.env.BROWSER_NAME : (yargs.BROWSER_NAME || 'chrome');
const HEADLESS = process.env.HEADLESS ? process.env.HEADLESS : (yargs.HEADLESS || false);

// default number of browser instances is 1
const browserInstances = process.env.instances ? process.env.instances : parseInt(yargs.instances) || 1;

exports.chromeCapabilities = {
  browserName: 'chrome',
  'goog:loggingPrefs': {
    browser: 'ALL'
  },
  'goog:chromeOptions': {
    args: [
      '--whitelisted-ips=',
      '--disable-infobars=true', // note this does not remove "Chrome is being controlled by automated test software" notification
      '--disable-gpu',
      'window-size=1920,1080',
      'test-type=browser',
      'disable-notifications',
      'incognito',
      'disable-application-cache',
      '-disable-extensions',
      '--ignore-certificate-errors',
      '--disable-dev-shm-usage',
      '--disable-browser-side-navigation',
      '--no-sandbox'
    ],
    excludeSwitches: ['enable-automation'],
    // Set download path and avoid prompting for download even though
    // this is already the default on Chrome but for completeness
    prefs: {
      download: {
        prompt_for_download: false,
        default_directory: downloadDir,
        directory_upgrade: true,
        'profile.password_manager_enabled': false, // Disable Chrome's annoying password manager
        credentials_enable_service: false,
        password_manager_enabled: false
      },
      safebrowsing: {
        enabled: false,
        disable_download_protection: true
      }
    }
  },

  // Default is 1.
  maxInstances: browserInstances
};

exports.firefoxCapabilities = {
  browserName: 'firefox',
  'moz:firefoxOptions': {
    'args': ['-safe-mode', '-window-size=1920,1080', '-private', '--foreground', '--purgecaches'],
    'prefs': {
      'browser.download.folderList': 2,
      'browser.download.dir': downloadDir,
      'browser.download.useDownloadDir': true,
      'browser.download.manager.showWhenStarting': false,
      'browser.helperApps.neverAsk.saveToDisk': 'application/pdf, application/postscript, ' +
        'application/msword, application/wordperfect, application/rtf, ' +
        'application/vnd.ms-excel, application/vnd.ms-powerpoint, text/html, ' +
        'text/plain, application/x-troff, application/x-troff-man, application/x-dvi, ' +
        'application/mathematica, application/octet-stream'
    },
    'log': { 'level': 'error' }
  },

  // Default is 1.
  maxInstances: browserInstances
};

if (HEADLESS === 'true') {
  this.chromeCapabilities['goog:chromeOptions'].args.push('--headless');
  this.firefoxCapabilities['moz:firefoxOptions'].args.push('--headless');
}

exports.common_config = {
  acceptInsecureCerts: true,
  services: ['devtools', 'intercept', ['selenium-standalone', {
    logPath: 'logs',
    installArgs: {
      drivers: {
        chrome: { version: '105.0.5195.52' },
        firefox: { version: '0.26.0' }
      }
    },
    args: {
      drivers: {
        chrome: { version: '105.0.5195.52' },
        firefox: { version: '0.26.0' }
      }
    },
  }]],

  specs: [],
  // Logging verbosity: trace | debug | info | warn | error | silent
  logLevel: 'error',
  // Enables colors for log output.
  coloredLogs: true,
  // Saves a screenshot to a given path if a command fails.
  screenshotPath: './errorShots/',
  // Set a base URL in order to shorten url command calls. If your url parameter starts with "/", then the base url gets prepended.
  baseURL: '',

  // runner: 'local',
  // baseUrl: 'http://localhost',

  // The number of retry attempts for an entire specfile when it fails as a whole.
  specFileRetries: 0,

  framework: 'cucumber',
  cucumberOpts: {
    // <boolean> show full backtrace for errors
    backtrace: true,
    // <string[]> module used for processing required features
    requireModule: ['@babel/register'],
    // <boolean< Treat ambiguous definitions as errors
    failAmbiguousDefinitions: true,
    // <boolean> invoke formatters without executing steps
    // dryRun: false,
    // <boolean> abort the run on first failure
    failFast: false,
    // <boolean> Enable this config to treat undefined definitions as
    // warnings
    ignoreUndefinedDefinitions: false,
    // <string[]> ("extension:module") require files with the given
    // EXTENSION after requiring MODULE (repeatable)
    name: [],
    // <boolean> hide step definition snippets for pending steps
    snippets: true,
    // <boolean> hide source uris
    source: true,
    // <string[]> (name) specify the profile to use
    profile: [],
    // <string[]> (file/dir) require files before executing features
    require: [
      'src/features/step-definitions/*.js',
      'src/features/support/hooks.js',
      'src/features/support/parameter-types.js'
    ],
    // <string> specify a custom snippet syntax
    snippetSyntax: '',
    // <boolean> fail if there are any undefined or pending steps
    strict: true,
    // <string> (expression) only execute the features or scenarios with
    // tags matching the expression, see
    // https://docs.cucumber.io/tag-expressions/
    tagExpression: `${yargs.tag || ''}`,
    // <boolean> add cucumber tags to feature or scenario name
    tagsInTitle: false,
    // <number> timeout for step definitions
    timeout: 300000
  },

  // Per default WebdriverIO commands getting executed in a synchronous way using
  // the wdio-sync package. If you still want to run your tests in an async way
  // using promises you can set the sync command to false.
  sync: false,

  // Default timeout for all waitFor* commands. 
  // This timeout only affects commands starting with waitFor* and their default wait time.
  waitforTimeout: 20000,
  // Timeout for any WebDriver request to a driver or grid.
  connectionRetryTimeout: 90000,
  // Maximum count of request retries to the Selenium server.
  connectionRetryCount: 3,
  // List of reporters to use.
  reporters: [
    ['allure', {
      outputDir: allureResultsPath,
      useCucumberStepReporter: true
    }],
    ['cucumberjs-json', {
      jsonFolder: jsonResultsPath,
      language: 'en',
    },
    ]
  ],

  onPrepare() {
    // remove failed screenshots info on start
    fileHelper.deleteFiles(failedScreenshots_tempFileName);
    // clear allure report
    fileHelper.deleteFiles(allureResultsPath);
    // clear cucumberjs-json report
    fileHelper.deleteFiles(jsonResultsPath);
    // clear browser logs
    fileHelper.deleteFiles(browserLogsPath);
  },

  // variable for creating and working with unique string values during one session
  before() {
    try {
      const data = fs.readFileSync('./storage.json');
      global.uniqueMap = JSON.parse(data);
    } catch (e) {
      global.uniqueMap = {};
    }
  },


  // Clear browser cookies after each scenario if restartBrowserBetweenTests set to true (default is false)
  afterScenario() {
    if (this.params.restartBrowserBetweenTests) {
      browser.deleteAllCookies();
    }
  },

  // Save uniqueMap variable in storage.json file if need to share data between separate test runs.
  after() {
    if (SAVE_INTERSESSIONAL_DATA) {
      fs.writeFile('storage.json', JSON.stringify(uniqueMap), 'utf8', (err) => {
        if (err) throw err;
        console.log('The storage.json file has been saved!');
      });
    }


  },

  onComplete: () => {
    // fileHelper.deleteEmptyLinesFromCucumberReport(jsonResultsPath);
    generate({
      // Required
      // This part needs to be the same path where you store the JSON files
      // default = '.tmp/json/'
      jsonDir: jsonResultsPath,
      reportPath: jsonResultsPath + '/cucumber/'
      // for more options see https://github.com/wswebcreation/multiple-cucumber-html-reporter#options
    });

    // convert txt to json
    if (fs.existsSync(failedScreenshots_tempFileName)) {
      const filesToReplace = fs
        .readFileSync(failedScreenshots_tempFileName, 'utf8')
        .split(DELIMITER)
        .filter(el => el)
        .map(el => JSON.parse(el))
        .reduce((jsonObject, screenshot) => {
          jsonObject.screenshots.push(screenshot);

          return jsonObject;
        }, { screenshots: [] });

      fs.writeFileSync(failedScreenshots_json, JSON.stringify(filesToReplace, null, 2));
      fs.unlinkSync(failedScreenshots_tempFileName);
    }


  },

  params: {
    timeout: 20000,
    localSleepTimeout: 3000,
    awsSleepTimout: 5000,
    loadTimeout: 5000,
    env: ENVIRONMENT,
    downloadDir,
    fileDownloadGlobalWait: 300000, // 5 min
    DELIMITER,
    SCREENSHOTS_DIRNAME,
    failedScreenshots_tempFileName,
    failedScreenshots_json,
    DEVICE_TYPE,
    DEVICE_NAME,
    restartBrowserBetweenTests: true, // if true, all browser cookies will be cleared after each scenario
    browser: BROWSER_NAME.toLowerCase()
  }
};