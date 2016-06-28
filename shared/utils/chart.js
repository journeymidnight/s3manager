import d3 from 'd3';
import _ from 'lodash';
import moment from 'moment';

export function generateLineChartConfig(data, cols, yFormat) {
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
      show: true,
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
            const yearFormatter = d3.time.format('%Y');
            const monthFormatter = d3.time.format('%Y-%m');
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
            } else if (x.getDate() !== 1) {
              return dayFormatter(x);
            } else if (x.getMonth() !== 1) {
              return monthFormatter(x);
            }

            return yearFormatter(x);
          },
        },
      },
    },
    padding: {
      top: 10,
      left: 50,
      right: 0,
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
    config.axis.y.tick.format = (bytes) => {
      const fmt = d3.format('.1f');

      if (bytes < 1024) {
        return `${fmt(bytes)}B`;
      } else if (bytes < 1024 * 1024) {
        return `${fmt(bytes / 1024)}kB`;
      } else if (bytes < 1024 * 1024 * 1024) {
        return `${fmt(bytes / 1024 / 1024)}MB`;
      }

      return `${fmt(bytes / 1024 / 1024 / 1024)}GB`;
    };
  } else if (yFormat === 'yuan') {
    config.axis.y.tick.format = (currency) => {
      const fmt = d3.format('.1f');

      if (currency < 1000) {
        return `${fmt(currency)}元`;
      } else if (currency < 10000) {
        return `${fmt(currency / 1000)}千元`;
      } else if (currency < 10000 * 10000) {
        return `${fmt(currency / 10000)}万元`;
      }

      return `${fmt(currency / 10000 / 10000)}亿元`;
    };
  } else if (yFormat === 'percentage') {
    config.axis.y.min = 0;
    config.axis.y.max = 100;
    config.axis.y.tick.format = (d) => {
      if (d >= 0) {
        return `${parseInt(d, 10)}%`;
      }

      return '';
    };
  }

  return config;
}
