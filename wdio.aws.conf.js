const {
  common_config,
  chromeCapabilities,
  firefoxCapabilities,
} = require('./common-config');

let capability;
const HTTP_PROXY = '192.168.1.1';
const SSL_HTTP_PROXY = '192.168.1.1';

switch (common_config.params.browser ) {
  case 'chrome':
    capability = { ...chromeCapabilities };
    common_config.services = ['devtools', 'intercept', 'chromedriver'];
    common_config.path = '/';
    break;
  case 'mobile':
    capability = { ...chromeCapabilities };
    capability['goog:chromeOptions'].mobileEmulation = {
      deviceName: common_config.params.DEVICE_NAME
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
  capabilities: [Object.assign(capability, {
    // proxy is used for AWS test run
    proxy: {
      proxyType: 'manual',
      httpProxy: HTTP_PROXY,
      sslProxy: SSL_HTTP_PROXY
    },
    maxInstances: 15,
  })],
  specs: ['src/features/*/*.feature'],

});