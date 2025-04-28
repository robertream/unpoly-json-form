module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      'node_modules/unpoly/unpoly.js',
      'src/**/*.js',
      'spec/**/*.spec.js'
    ],
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },
    singleRun: true,
    concurrency: 1,
    client: {
      clearContext: false
    }
  })
}
