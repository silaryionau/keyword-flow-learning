const {
  common_config,
  chromeCapabilities,
  firefoxCapabilities,
} = require('./common-config');

let capability;
const singrisy_config = {
  // syngrisi server endpoint
  endpoint: `http://localhost:3003/`,
  // syngrisi API key
  apikey: process.env['SYNGRISI_API_KEY'] || '',
  // project name
  project: 'My Project',
  // the tested branch
  branch: 'master',
  // run name (will be auto generated if not present)
  runname: process.env['RUN_NAME'],
  // run name (will be auto generated if not present)
  runident: process.env['RUN_IDENT'],
  // tag for visual regression scenarios
  // for all scenarios with this tag the service will create session on syngrisi
  // if tag is empty the visual session will be created for all scenarios
  // tag: '@visual',
}

switch (common_config.params.browser) {
  case 'chrome':
    capability = { ...chromeCapabilities };
    common_config.services = ['intercept', 'chromedriver', ['syngrisi-cucumber', singrisy_config]];
    common_config.path = '/';

    if (common_config.params.DEVICE_TYPE === 'mobile') {
      capability = { ...chromeCapabilities };
      capability['goog:chromeOptions'].mobileEmulation = {
        deviceName: common_config.params.DEVICE_NAME
      }
    }
    break;
  case 'firefox':
    capability = { ...firefoxCapabilities };
    common_config.services = ['geckodriver'];
    common_config.path = '/';
    break;
  default:
    capability = { ...chromeCapabilities };
    break;
}



exports.config = Object.assign({}, common_config, {
  capabilities: [{
    ...capability,
    'cjson:metadata': {
      // For a browser
      browser: {
        name: 'chrome',
        version: '99',
      },
      device: 'Laptop',
      platform: {
        name: 'Windows',
        version: '10.0.19043'
      }
    }
  }],
  // Used for library tests
  specs: ['src/features/**/*.feature']
});
