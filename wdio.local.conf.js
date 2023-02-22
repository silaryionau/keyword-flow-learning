const {
  common_config,
  chromeCapabilities,
  firefoxCapabilities,
} = require('./common-config');

let capability;

switch (common_config.params.browser) {
  case 'chrome':
    capability = { ...chromeCapabilities };
    common_config.params.env = 'LOCAL';
    common_config.services = ['intercept', 'chromedriver'];
    common_config.path = '/';

    if (common_config.params.DEVICE_TYPE === 'mobile') {
      capability = { ...chromeCapabilities };
      capability['goog:chromeOptions'].mobileEmulation = {
        deviceName: common_config.params.DEVICE_NAME,
      };
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
  capabilities: [
    {
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
          version: '10.0.19043',
        },
      },
    },
  ],
  // Used for library tests
  specs: ['src/features/**/*.feature'],
});
