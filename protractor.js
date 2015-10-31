var configuration = {
  multiCapabilities: [{
    'browserName': 'chrome'
  }],

  specs: ['test/smoke/eager-loading-notifications.js'],

  jasmineNodeOpts: {
    onComplete:             null,
    isVerbose:              true,
    showColors:             true,
    includeStackTrace:      true,
    defaultTimeoutInterval: 360000
  }
};

configuration.baseUrl = 'http://localhost:3000';
configuration.directConnect = true;

exports.config = configuration;
