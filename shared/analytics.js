// const analytics = require('analytics.js-loader')({
//   writeKey: 'iOJlVzoiriE1luO0OkD5UAcd2XbaO4E5',
//   skipPageCall: false,
// });
const analytics = window.analytics;

analytics.track('Visited', {
  source: undefined,
});

export default analytics;
