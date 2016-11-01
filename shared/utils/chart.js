import d3 from 'd3';
import _ from 'lodash';
import moment from 'moment';
import i18n from '../i18n';

export function mergeTimeSeries(...args) {
  const mergedTimeSeries = {};
  _.each(args, (ts) => {
    const field = ts[0];
    const timeSeries = ts[1];

    _.each(timeSeries, (t) => {
      if (!mergedTimeSeries[t.timestamp]) {
        mergedTimeSeries[t.timestamp] = {
          timestamp: t.timestamp,
        };
      }

      mergedTimeSeries[t.timestamp][field] = t.value;
    });
  });
  return _.map(mergedTimeSeries, (v) => {
    return v;
  });
}

export function generateChartConfig(data, cols, yFormat) {
  const config = {
    transition: {
      duration: 0,
    },
    interaction: {
      enabled: true,
    },
    grid: {
      y: {
        show: true,
      },
    },
    point: {
      show: false,
    },
    legend: {
      item: {
        onclick: () => { },
      },
    },
    axis: {
      y: {
        tick: {
          format: d3.format('.2s'),
        },
      },
      x: {
        type: 'timeseries',
        localtime: true,
        tick: {
          format: (x) => {
            const dayFormatter = d3.time.format('%m-%d');
            const hourFormatter = d3.time.format('%H:%M');
            const minuteFormatter = d3.time.format('%H:%M');
            const secondFormatter = d3.time.format('%M:%S');

            const timestamp = x.getTime() / 1000 - (x.getTimezoneOffset() / 60) * 3600;
            if (timestamp % 60) {
              return secondFormatter(x);
            } else if (timestamp % 3600) {
              return minuteFormatter(x);
            } else if (timestamp % 86400) {
              return hourFormatter(x);
            }

            return dayFormatter(x);
          },
        },
      },
    },
    padding: {
      top: 10,
      left: 60,
      right: 20,
      bottom: 0,
    },
    data: {
      x: 'timestamp',
      columns: [['timestamp'].concat(data.map((item) => { return new Date(moment.utc(item.timestamp)); }))]
      .concat(_.map(cols, (options, col) => {
        return [options.name].concat(data.map((item) => {
          if (item[col] === undefined) {
            return null;
          }

          return item[col];
        }));
      })),
    },
  };

  if (yFormat === 'bytes') {
    config.axis.y.min = 0;
    config.axis.y.tick.format = (bytes) => {
      const fmt = d3.format('.1f');

      if (bytes < 0) {
        return '';
      } else if (bytes < 1024) {
        return `${fmt(bytes)}B`;
      } else if (bytes < 1024 * 1024) {
        return `${fmt(bytes / 1024)}KB`;
      } else if (bytes < 1024 * 1024 * 1024) {
        return `${fmt(bytes / 1024 / 1024)}MB`;
      }

      return `${fmt(bytes / 1024 / 1024 / 1024)}GB`;
    };
  } else if (yFormat === 'bps') {
    config.axis.y.min = 0;
    config.axis.y.tick.format = (bytes) => {
      const fmt = d3.format('.1f');

      if (bytes < 0) {
        return '';
      } else if (bytes < 1024) {
        return `${fmt(bytes)}bps`;
      } else if (bytes < 1024 * 1024) {
        return `${fmt(bytes / 1024)}kbps`;
      } else if (bytes < 1024 * 1024 * 1024) {
        return `${fmt(bytes / 1024 / 1024)}mbps`;
      }

      return `${fmt(bytes / 1024 / 1024 / 1024)}gbps`;
    };
  } else if (yFormat === 'megabytes') {
    config.axis.y.min = 0;
    config.axis.y.tick.format = (bytes) => {
      const fmt = d3.format('.1f');

      if (bytes < 0) {
        return '';
      } else if (bytes < 1024) {
        return `${fmt(bytes)}MB`;
      } else if (bytes < 1024 * 1024) {
        return `${fmt(bytes / 1024)}GB`;
      }

      return `${fmt(bytes / 1024 / 1024)}TB`;
    };
  } else if (yFormat === 'kilobytes') {
    config.axis.y.min = 0;
    config.axis.y.tick.format = (bytes) => {
      const fmt = d3.format('.1f');

      if (bytes < 0) {
        return '';
      } else if (bytes < 1024) {
        return `${fmt(bytes)}KB`;
      } else if (bytes < 1024 * 1024) {
        return `${fmt(bytes / 1024)}MB`;
      } else if (bytes < 1024 * 1024 * 1024) {
        return `${fmt(bytes / 1024 / 1024)}GB`;
      }

      return `${fmt(bytes / 1024 / 1024)}TB`;
    };
  } else if (yFormat === 'yuan') {
    config.axis.y.min = 0;
    config.axis.y.tick.format = (currency) => {
      const fmt = d3.format('.1f');

      if (currency < 0) {
        return '';
      } else if (currency < 1000) {
        return `${fmt(currency)}${i18n.t('units.yuan')}`;
      } else if (currency < 10000) {
        return `${fmt(currency / 1000)}${i18n.t('units.k')}${i18n.t('units.yuan')}`;
      } else if (currency < 10000 * 10000) {
        return `${fmt(currency / 10000)}${i18n.t('units.w')}${i18n.t('units.yuan')}`;
      }

      return `${fmt(currency / 10000 / 10000)}${i18n.t('units.y')}${i18n.t('units.yuan')}`;
    };
  } else if (yFormat === 'percentage') {
    config.axis.y.min = 0;
    config.axis.y.max = 100;
    config.axis.y.tick.format = (d) => {
      if (d >= 0 && d <= 100) {
        return `${parseInt(d, 10)}%`;
      }

      return '';
    };
  } else if (yFormat === 'count') {
    config.axis.y.min = 0;
    config.axis.y.tick.format = (count) => {
      const fmt = d3.format('d');

      if (count < 0 || !(fmt(count) > 0)) {
        return '';
      } else if (count < 1000) {
        return `${fmt(count)}${i18n.t('units.count')}`;
      }

      return `${fmt(count / 1000)}${i18n.t('units.k')}${i18n.t('units.count')}`;
    };
  } else {
    config.axis.y.min = 0;
    config.axis.y.tick.format = (d) => {
      const fmt = d3.format('.1f');

      if (d >= 0) {
        return fmt(d);
      }

      return '';
    };
  }

  return config;
}

export function generateLineChartConfig(data, cols, yFormat) {
  const config = generateChartConfig(data, cols, yFormat);
  config.data.type = 'line';
  return config;
}

export function generateBarChartConfig(data, cols, yFormat) {
  const config = generateChartConfig(data, cols, yFormat);
  config.bar = {
    width: {
      ratio: 0.5,
    },
  };
  config.data.type = 'bar';
  return config;
}

export function generateAreaChartConfig(data, cols, yFormat) {
  const config = generateChartConfig(data, cols, yFormat);
  config.data.type = 'area';
  return config;
}

export function generateStepChartConfig(data, cols, yFormat) {
  const config = generateChartConfig(data, cols, yFormat);
  config.data.type = 'step';
  return config;
}
