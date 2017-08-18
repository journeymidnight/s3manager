import moment from 'moment';
import React from 'react';
import DatePicker from 'react-datepicker';
import { Bar, Select, Radio, Loading } from '../../../lecloud-design';
import Page, { attach } from '../../../shared/pages/Page';
import { setHeader, extendContext, notifyAlert } from '../../redux/actions';
import * as BucketActions from '../redux/actions.bucket';
import 'react-datepicker/dist/react-datepicker.css';


class ResourceMonitorConsole extends Page {

  constructor(props) {
    super(props);
    const { t } = this.props;

    this.periods = [{
      value: '1day',
      name: t('pageResourceMonitors.periods.1day'),
    }, {
      value: '7days',
      name: t('pageResourceMonitors.periods.7days'),
    }, {
      value: '30days',
      name: t('pageResourceMonitors.periods.30days'),
    }];

    this.state = {
      monitorType: undefined,
      bucketName: undefined,
      startDate: moment(),
      startDateMaxDate: moment(),
      endDate: moment(),
      endDateMaxDate: moment(),
      period: '1day',
    };

    this.refresh = this.refresh.bind(this);
    this.compareDate = this.compareDate.bind(this);
    this.changeMonitorType = this.changeMonitorType.bind(this);
    this.getRequestDataCb = this.getRequestDataCb.bind(this);
    this.requestData = this.requestData.bind(this);
    this.handleBucket = this.handleBucket.bind(this);
    this.handleStartDate = this.handleStartDate.bind(this);
    this.handleEndDate = this.handleEndDate.bind(this);
    this.handlePeriod = this.handlePeriod.bind(this);
    this.combine = this.combine.bind(this);
    this.getCompleteTime = this.getCompleteTime.bind(this);
    this.combineYValue = this.combineYValue.bind(this);
  }

  initialize() {
    const { t, dispatch, servicePath, routerKey, region } = this.props;
    dispatch(setHeader(t('resourceMonitors'), `${servicePath}/monitors`));

    dispatch(BucketActions.listBuckets(undefined, region.regionId))
      .then(() => {
        const { creationDate } = this.props.context.buckets[0];
        this.setState({
          bucketName: this.props.context.buckets[0].name,
          creationDate: moment(creationDate),
          startDateMinDate: moment(creationDate),
          endDateMinDate: moment(creationDate),
        }, () => dispatch(extendContext({ initialized: true }, undefined)));
      });

    dispatch(extendContext({ loading: true }, routerKey));
  }

  compareDate(date1, date2, before) {
    if (before) {
      if (date1.isSameOrBefore(date2, 'day')) {
        return date1;
      }
      return date2;
    }
    if (date1.isSameOrBefore(date2, 'day')) {
      return date2;
    }
    return date1;
  }

  changeMonitorType(monitorType) {
    this.setState({
      monitorType,
    }, () => this.refresh()());
  }

  refresh() {
    return (e) => {
      if (e) {
        e.preventDefault();
      }

      if (this.state.bucketName) {
        const { dispatch, routerKey } = this.props;

        this.requestData()
          .then(() => {
            dispatch(extendContext({ loading: false }, routerKey));
          });

        dispatch(extendContext({ loading: true }, routerKey));
      }
    };
  }

  getRequestDataCb() {
    switch (this.state.monitorType) {
      case 'usage': {
        return BucketActions.requestGetUsageByHour;
      }
      case 'flow': {
        return BucketActions.requestGetFlowByHour;
      }
      case 'api': {
        return BucketActions.requestGetOpByHour;
      }
      default: {
        return BucketActions.requestGetUsageByHour;
      }
    }
  }

  requestData() {
    const { dispatch, region, routerKey } = this.props;
    const { bucketName, startDate, endDate } = this.state;
    let { period } = this.state;

    if (startDate === undefined || endDate === undefined) {
      period = '1day';
      this.handlePeriod('1day');
    }

    const nowLocal = moment();
    dispatch(extendContext({ monitorMomentLocal: nowLocal }, routerKey));
    const todayLocalFormat = moment(nowLocal).format('YYYYMMDD');
    const nowLocalFormat = moment(nowLocal).format('YYYYMMDDHH0030');
    const startOfDayLocalFormat = moment(nowLocal).startOf('day').format('YYYYMMDDHHmmss');

    switch (period) { // TODO: change regionId
      case 'someDay': {
        return dispatch(this.getRequestDataCb()(routerKey, 'cn-north-1', bucketName, startDate.format('YYYYMMDDHHmmss'),
          moment(endDate).add(1, 'days').subtract(1, 'seconds').format('YYYYMMDDHHmmss')));
      }
      case '1day': {
        return dispatch(this.getRequestDataCb()(routerKey, 'cn-north-1', bucketName, startOfDayLocalFormat, nowLocalFormat));
      }
      case '7days': {
        const sevenDaysBeforeLocalFormat = moment(nowLocal).subtract(7, 'days').format('YYYYMMDD');
        return Promise.all([
          dispatch(this.getRequestDataCb()(routerKey, 'cn-north-1', bucketName, startOfDayLocalFormat, nowLocalFormat)),
          dispatch(BucketActions.requestGetStaticsByDay(routerKey, region.regionId, bucketName, sevenDaysBeforeLocalFormat, todayLocalFormat)),
        ]);
      }
      case '30days': {
        const startOfMonthLocalFormat = moment(nowLocal).startOf('month').format('YYYYMMDD');
        return Promise.all([
          dispatch(this.getRequestDataCb()(routerKey, 'cn-north-1', bucketName, startOfDayLocalFormat, nowLocalFormat)),
          dispatch(BucketActions.requestGetStaticsByDay(routerKey, region.regionId, bucketName, startOfMonthLocalFormat, todayLocalFormat)),
        ]);
      }
      default:
        return Promise.all([
          dispatch(this.getRequestDataCb()(routerKey, 'cn-north-1', bucketName, startOfDayLocalFormat, nowLocalFormat)),
          dispatch(BucketActions.requestGetStaticsByDay(routerKey, region.regionId, bucketName, startDate.format('YYYYMMDD'), endDate.format('YYYYMMDD'))),
        ]);
    }
  }

  handleBucket(bucketName) {
    const creationDate = this.props.context.buckets.find(bucket => bucket.name === bucketName).creationDate;
    if (this.state.startDate === undefined || this.state.endDate === undefined) {
      this.setState({
        bucketName,
        creationDate,
        startDateMinDate: moment(creationDate),
        endDateMinDate: moment(creationDate),
      }, () => {
        this.handlePeriod('1day');
      });
    } else {
      this.setState({
        bucketName,
        creationDate,
        startDate: this.compareDate(moment(this.state.startDate), moment(creationDate)),
        startDateMinDate: moment(creationDate),
        endDateMinDate: moment(creationDate),
      }, () => {
        if (this.state.startDate && this.state.endDate) {
          this.refresh()();
        }
      });
    }
  }

  handleStartDate(startDate) {
    if (!this.state.endDate ||
      this.state.endDate.isAfter(this.compareDate(moment(startDate).add(30, 'days'), moment(), true), 'day') ||
      this.state.endDate.isBefore(startDate, 'day')
    ) {
      this.setState({
        startDate,
        startDateMinDate: moment(this.state.creationDate),
        startDateMaxDate: moment(),
        startDateError: false,
        endDate: undefined,
        endDateMinDate: startDate,
        endDateMaxDate: this.compareDate(moment(startDate).add(30, 'days'), moment(), true),
        endDateError: true,
      }, () => this.props.dispatch(notifyAlert(this.props.t('pageResourceMonitors.endDateError'))));
    } else {
      this.setState({
        shouldAddTodayPoint: moment(this.state.endDate).get('date') === moment().get('date'),
        startDate,
        startDateMinDate: moment(this.state.creationDate),
        startDateMaxDate: moment(),
        startDateError: false,
        endDateMinDate: moment(this.state.creationDate),
        endDateMaxDate: moment(),
        endDateError: false,
        period: (() => {
          if (startDate.isSame(this.state.endDate, 'day')) {
            if (startDate.isSame(moment(), 'day')) {
              return '1day';
            }
            return 'someDay';
          }
          return undefined;
        })(),
        date: (() => {
          if (startDate.isSame(this.state.endDate, 'day') && !startDate.isSame(moment(), 'day')) {
            return startDate;
          }
          return undefined;
        })(),
      }, () => {
        this.refresh()();
      });
    }
  }

  handleEndDate(endDate) {
    if (!this.state.startDate ||
      this.state.startDate.isBefore(this.compareDate(moment(endDate).subtract(30, 'days'), moment(this.state.creationDate)), 'day') ||
      this.state.startDate.isAfter(endDate, 'day')
    ) {
      this.setState({
        startDate: undefined,
        startDateMinDate: this.compareDate(moment(endDate).subtract(30, 'days'), moment(this.state.creationDate)),
        startDateMaxDate: endDate,
        startDateError: true,
        endDate,
        endDateMinDate: moment(this.state.creationDate),
        endDateMaxDate: moment(),
        endDateError: false,
      }, () => this.props.dispatch(notifyAlert(this.props.t('pageResourceMonitors.startDateError'))));
    } else {
      this.setState({
        shouldAddTodayPoint: moment(endDate).get('date') === moment().get('date'),
        startDateMinDate: moment(this.state.creationDate),
        startDateMaxDate: moment(),
        startDateError: false,
        endDate,
        endDateMinDate: moment(this.state.creationDate),
        endDateMaxDate: moment(),
        endDateError: false,
        period: (() => {
          if (endDate.isSame(this.state.startDate, 'day')) {
            if (endDate.isSame(moment(), 'day')) {
              return '1day';
            }
            return 'someDay';
          }
          return undefined;
        })(),
        date: (() => {
          if (endDate.isSame(this.state.startDate, 'day') && !endDate.isSame(moment(), 'day')) {
            return endDate;
          }
          return undefined;
        })(),
      }, () => this.refresh()());
    }
  }

  handlePeriod(period) {
    const startDate = (() => {
      switch (period) {
        case '1day': {
          return moment();
        }
        case '7days': {
          return moment().subtract(7, 'days');
        }
        case '30days': {
          return moment().startOf('month');
        }
        default:
          return moment();
      }
    })();

    this.setState({
      shouldAddTodayPoint: true,
      startDate: this.compareDate(moment(startDate), moment(this.state.creationDate)),
      startDateMinDate: moment(this.state.creationDate),
      startDateMaxDate: moment(),
      startDateError: false,
      endDate: moment(),
      endDateMinDate: moment(this.state.creationDate),
      endDateMaxDate: moment(),
      endDateError: false,
      period,
      date: undefined,
    }, () => {
      this.refresh()();
    });
  }

  getCompleteTime(dataArray, date) {
    const idealHourArray = [];
    let startOfDayTimestampLocal = moment(date).valueOf();
    if (date) {
      for (let i = 0; i < 24; i++) {
        idealHourArray.push(i);
      }
    } else {
      const nowLocal = this.props.context.monitorMomentLocal;
      const nowHourLocal = Number(moment(nowLocal).format('HH'));
      startOfDayTimestampLocal = moment(nowLocal).startOf('day').valueOf();

      let hour = 0;
      while (hour <= nowHourLocal) {
        idealHourArray.push(hour);
        hour++;
      }
    }

    const realHourArray = dataArray.map((data) => Number(moment.utc(Number(data.time)).local().format('HH')));
    const missingHourArray = idealHourArray.filter((time) => {
      return !realHourArray.includes(time);
    });
    return dataArray.concat(missingHourArray.map((time) => ({
      time: startOfDayTimestampLocal + time * 60 * 60 * 1000,
    })));
  }

  combine(data, nextData) {
    return (field) => {
      if (field !== 'timestamp' && nextData[field] !== 0) {
        data[field] = nextData[field];
      }
    };
  }

  combineYValue(dataArray) {
    let sortedDataArray = [];
    if (dataArray.length > 0) {
      sortedDataArray = dataArray.sort((a, b) => {
        return a.timestamp - b.timestamp;
      });
    }

    const combinedDataArray = [];
    for (let i = 0, len = sortedDataArray.length; i < len; i++) {
      if (sortedDataArray[i + 1] && sortedDataArray[i].timestamp === sortedDataArray[i + 1].timestamp) {
        const combinedData = sortedDataArray[i];
        while (sortedDataArray[i + 1] && sortedDataArray[i].timestamp === sortedDataArray[i + 1].timestamp) {
          Object.keys(combinedData).forEach(this.combine(combinedData, sortedDataArray[i + 1]));
          i++;
        }
        combinedDataArray.push(combinedData);
      } else {
        combinedDataArray.push(sortedDataArray[i]);
      }
    }
    return combinedDataArray;
  }

  render() {
    const { t, context } = this.props;
    return (
      <div>
        <Bar>
          <h2 className="bar-title">{this.state.monitorType ? t(`${this.state.monitorType}Monitor`) : ''}</h2>
        </Bar>

        <Bar>
          <button
            className="button button-icon"
            onClick={this.refresh(this.state.period)}
          >
            <Loading loading={context.loading} />
          </button>
          {this.props.context.buckets && <Select
            options={this.props.context.buckets.map((bucket) => (
              { value: bucket.name }))
            }
            onChange={this.handleBucket}
          />}
          <span
            style={{
              fontSize: '12px',
              padding: '6px 10px',
              margin: '15px 0',
              display: 'inline-block',
            }}
          >
          {t('pageResourceMonitors.from')}
          </span>
          <DatePicker
            dateFormat="YYYY/MM/DD"
            className="input date-picker"
            minDate={this.state.startDateMinDate}
            maxDate={this.state.startDateMaxDate}
            selected={this.state.startDate}
            onChange={this.handleStartDate}
          />
          <span
            style={{
              fontSize: '12px',
              padding: '6px 10px',
              margin: '15px 0',
              display: 'inline-block',
            }}
          >
          {t('pageResourceMonitors.to')}
          </span>

          <DatePicker
            dateFormat="YYYY/MM/DD"
            className="input date-picker"
            minDate={this.state.endDateMinDate}
            maxDate={this.state.endDateMaxDate}
            selected={this.state.endDate}
            onChange={this.handleEndDate}
          />
          <div className="pull-right" style={{ margin: '15px 0' }}>
            <Radio
              type="text"
              options={this.periods}
              onChange={this.handlePeriod}
            />
          </div>
        </Bar>

        {this.props.context.initialized && React.cloneElement(this.props.children, {
          t: this.props.t,
          context: this.props.context,
          period: this.state.period,
          date: this.state.date,
          shouldAddTodayPoint: this.state.shouldAddTodayPoint,
          changeMonitorType: this.changeMonitorType,
          getCompleteTime: this.getCompleteTime,
          combineYValue: this.combineYValue,
          requestData: this.requestData,
        })}
      </div>
    );
  }
}

export default attach(ResourceMonitorConsole);
