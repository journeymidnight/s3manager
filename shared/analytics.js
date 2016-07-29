import mixpanel from 'mixpanel-browser';

mixpanel.init('cc1f30308ba75740c13580c25937577d');
mixpanel.track('Visited', {
  source: undefined,
});

export default mixpanel;
