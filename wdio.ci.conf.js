const {
  common_config,
  chromeCapabilities,
  firefoxCapabilities,
} = require('./common-config');


let capability;

switch (common_config.params.browser) {
  case 'chrome':
    capability = { ...chromeCapabilities };
    common_config.services = ['devtools', 'intercept', 'chromedriver'];
    common_config.path = '/';
    break;
  case 'mobile':
    capability = { ...chromeCapabilities };
    capability['goog:chromeOptions'].mobileEmulation = {
      deviceName: common_config.params.browser.DEVICE_NAME
    }
    break;
  case 'firefox':
    capability = { ...firefoxCapabilities };
    common_config.services = ['devtools', 'intercept', 'geckodriver'];
    common_config.path = '/';
    break;
  default:
    capability = { ...chromeCapabilities };
    break;
}

exports.config = Object.assign({}, common_config, {
  capabilities: [capability],
  // Used for library tests
  specs: ['src/features/**/*.feature']
});
