const analytics = require('analytics.js-loader')({
  writeKey: 'iOJlVzoiriE1luO0OkD5UAcd2XbaO4E5',
  skipPageCall: false,
});

analytics.track('Visited', {
  source: undefined,
});

export default analytics;
