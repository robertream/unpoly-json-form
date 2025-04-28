module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      'spec/**/*.spec.js',
      'src/**/*.js'
    ],
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },
    singleRun: true,
    concurrency: Infinity
  })
}
