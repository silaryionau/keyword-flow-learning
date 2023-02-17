const { common_config, firefoxCapabilities, chromeCapabilities } = require('./common-config');
const yargs = require('yargs').argv;
const BROWSER = process.env.BROWSER_NAME || (yargs.BROWSER_NAME || 'chrome');
const BROWSER_VERSION = process.env.BROWSER_VERSION || (yargs.BROWSER_VERSION || 'latest');
const PLATFORM = process.env.PLATFORM || (yargs.PLATFORM || 'windows 10');
const MOBILE_PLATFORM = process.env.MOBILE_PLATFORM || (yargs.MOBILE_PLATFORM || 'iPhone X Simulator');
const PLATFORM_NAME = process.env.PLATFORM_NAME || (yargs.PLATFORM_NAME || 'iOS');
const PLATFORM_VERSION = process.env.PLATFORM_VERSION || (yargs.PLATFORM_VERSION || '12.2');
const JOB_NAME = process.env.JOB_NAME || (yargs.JOB_NAME || 'Smoke Tests');
const SAUCE_USERNAME = process.env.SAUCE_USERNAME || 'SAUCE_USERNAME';
const SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY || 'SAUCE_ACCESS_KEY';
const SELENIUM_VERSION = process.env.SELENIUM_VERSION || '3.13.0';
const APPIUM_VERSION = process.env.APPIUM_VERSION || '1.12.1';
const DEVICE = process.env.DEVICE || (yargs.DEVICE || 'PC');
const DEVICE_NAME = process.env.DEVICE_NAME || (yargs.PLATFORM_NAME || 'iPhone X Simulator');

const DEVICE_ORIENTATION = process.env.DEVICE_ORIENTATION || (yargs.DEVICE_ORIENTATION || 'portrait');
const SCREEN_RESOLUTION = process.env.SCREEN_RESOLUTION || (yargs.SCREEN_RESOLUTION || '1920x1080');

const TUNNEL_IDENTIFIER = 'TUNNEL_IDENTIFIER';
const PARENT_TUNNEL = 'PARENT_TUNNEL';
const MAX_INSTANCES = 3;
const capabilities = DEVICE === 'PC' ? _processSauceConfig() : _processMobileSauceConfig();

exports.config = Object.assign({}, common_config, {
  services: ['sauce'],
  user: SAUCE_USERNAME,
  key: SAUCE_ACCESS_KEY,
  region: 'us',
  // sauceConnect allows to run tests against a server that is not accessible to the Internet (like on localhost). More info:
  // https://webdriver.io/docs/cloudservices.html#sauce-connect-https-wikisaucelabscom-display-docs-sauce-connect-proxy
  // https://wiki.saucelabs.com/display/DOCS/Sauce+Connect+Proxy
  sauceConnect: true,
  // Sauce limits how long a browser can wait for a test to send a new command
  idleTimeout: 600,
  capabilities: [capabilities],
  specs: ['./src/features/ui-features/mobile-test.feature']
});

// -- internal -- //
function _processSauceConfig() {
  const conf = {
    browserName: BROWSER.toLowerCase(),
    browserVersion: BROWSER_VERSION,
    platformName: PLATFORM,
    maxInstances: MAX_INSTANCES,
    'sauce:options': {
      seleniumVersion: SELENIUM_VERSION,
      tunnelIdentifier: TUNNEL_IDENTIFIER,
      parentTunnel: PARENT_TUNNEL,
      name: JOB_NAME,
      // TODO: investigate why videoUploadOnPass: false does not work, it still saves the video for passed tests
      videoUploadOnPass: false,
      recordScreenshots: false,
      screenResolution: SCREEN_RESOLUTION,
    }
  };

  switch (conf.browserName) {
    case 'firefox': {
      conf['moz:firefoxOptions'] = firefoxCapabilities['moz:firefoxOptions'];
      break;
    }
    case 'chrome': {
      conf['goog:chromeOptions'] = chromeCapabilities['goog:chromeOptions'];
      break;
    }
    case 'internet explorer': {
      console.warn('IE not fully supported');
      break;
    }
    case 'microsoftedge': {
      console.warn('EDGE not fully supported');
      break;
    }
    case 'safari': {
      console.warn('Safari not fully supported');
      break;
    }
    default: {
      throw new Error('Can\'t find matching browser capabilities. Please check config');
    }
  }

  return conf;
}

function _processMobileSauceConfig() {
  const conf = {
    browserName: BROWSER,
    appiumVersion: APPIUM_VERSION,
    deviceName: DEVICE_NAME,
    deviceOrientation: DEVICE_ORIENTATION,
    platformVersion: PLATFORM_VERSION,
    platformName: PLATFORM_NAME,
    tunnelIdentifier: TUNNEL_IDENTIFIER,
    parentTunnel: PARENT_TUNNEL,
    name: JOB_NAME,
    videoUploadOnPass: false,
    recordScreenshots: false,
    platform: MOBILE_PLATFORM,
  };

  return conf;
}

// https://webdriver.io/docs/sauce-service/
// https://docs.saucelabs.com/web-apps/automated-testing/selenium/
