import moment from 'moment';
import React from 'react';
import DatePicker from 'react-datepicker';
import Page, { attach } from '../../shared/pages/Page';
import { setHeader, extendContext } from '../../console-common/redux/actions';
import * as BucketActions from '../redux/actions.bucket';
import 'react-datepicker/dist/react-datepicker.css';


class ResourceMonitorConsole extends Page {

  constructor(props) {
    super(props);
    const { t } = this.props;

    this.periods = [{
      id: '1day',
      name: t('pageResourceMonitors.periods.1day'),
    }, {
      id: '7days',
      name: t('pageResourceMonitors.periods.7days'),
    }, {
      id: '30days',
      name: t('pageResourceMonitors.periods.30days'),
    }];

    this.state = {
      monitorType: undefined,
      bucketName: undefined,
      startDate: moment(),
      startDateMinDate: moment.utc(moment() - 30 * 24 * 60 * 60 * 1000),
      startDateMaxDate: moment(),
      endDate: moment(),
      endDateMinDate: moment(),
      endDateMaxDate: moment.utc(moment() + 30 * 24 * 60 * 60 * 1000),
      period: '1day',
    };

    this.refresh = this.refresh.bind(this);
    this.changeMonitorType = this.changeMonitorType.bind(this);
    this.getRequestDataCb = this.getRequestDataCb.bind(this);
    this.requestData = this.requestData.bind(this);
    this.handleBucket = this.handleBucket.bind(this);
    this.handleStartDate = this.handleStartDate.bind(this);
    this.handleEndDate = this.handleEndDate.bind(this);
    this.handlePeriod = this.handlePeriod.bind(this);
    this.getCompleteTime = this.getCompleteTime.bind(this);
    this.combineYValue = this.combineYValue.bind(this);
  }

  initialize() {
    const { t, dispatch, servicePath, routerKey, region } = this.props;
    dispatch(setHeader(t('resourceMonitors'), `${servicePath}/monitors`));

    dispatch(BucketActions.listBuckets(undefined, region.regionId))
      .then(() => {
        this.setState({
          bucketName: this.props.context.buckets[0].name,
        }, () => dispatch(extendContext({ initialized: true }, undefined)));
      });

    dispatch(extendContext({ loading: true }, routerKey));
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

      const { dispatch, routerKey } = this.props;

      this.requestData()
        .then(() => {
          dispatch(extendContext({ loading: false }, routerKey));
        });

      dispatch(extendContext({ loading: true }, routerKey));
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
    const { bucketName, period, startDate, endDate } = this.state;

    const nowLocal = moment();
    dispatch(extendContext({ monitorMomentLocal: nowLocal }, routerKey));
    const todayLocalFormat = moment(nowLocal).format('YYYYMMDD');

    switch (period) {
      case '1day': {
        const nowLocalFormat = moment(nowLocal).format('YYYYMMDDHHmmss');
        const startOfDayLocalFormat = moment(nowLocal).startOf('day').format('YYYYMMDDHHmmss');
        return dispatch(this.getRequestDataCb()(routerKey, 'cn-north-1', bucketName, startOfDayLocalFormat, nowLocalFormat)); // TODO: change regionId
      }
      case '7days': {
        const sevenDaysBeforeLocalFormat = moment(nowLocal).subtract(7, 'days').format('YYYYMMDD');
        return dispatch(BucketActions.requestGetStaticsByDay(routerKey, region.regionId, bucketName, sevenDaysBeforeLocalFormat, todayLocalFormat));
      }
      case '30days': {
        const startOfMonthLocalFormat = moment(nowLocal).startOf('month').format('YYYYMMDD');
        return dispatch(BucketActions.requestGetStaticsByDay(routerKey, region.regionId, bucketName, startOfMonthLocalFormat, todayLocalFormat));
      }
      default:
        return dispatch(BucketActions.requestGetStaticsByDay(routerKey, region.regionId, bucketName, startDate.format('YYYYMMDD'), endDate.format('YYYYMMDD')));
    }
  }

  handleBucket(e, bucketName) {
    e.preventDefault();
    this.setState({
      bucketName,
    }, () => this.refresh()());
  }

  handleStartDate(startDate) {
    this.setState({
      startDate,
      endDateMinDate: startDate,
      endDateMaxDate: moment(startDate).add(30, 'days'),
      period: undefined,
    }, () => {
      this.refresh()();
    });
  }

  handleEndDate(endDate) {
    this.setState({
      endDate,
      startDateMinDate: moment(endDate).subtract(30, 'days'),
      startDateMaxDate: endDate,
      period: undefined,
    }, () => {
      this.refresh()();
    });
  }

  handlePeriod(period) {
    this.setState({
      period,
      startDate: (() => {
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
      })(),
    }, () => {
      this.refresh()();
    });
  }

  getCompleteTime(dataArray) {
    const nowLocal = this.props.context.monitorMomentLocal;
    const nowHourLocal = Number(moment(nowLocal).format('HH'));
    const startOfDayTimestampLocal = moment(nowLocal).startOf('day').valueOf();

    const idealHourArray = [];
    let hour = 0;
    while (hour <= nowHourLocal) {
      idealHourArray.push(hour);
      hour++;
    }

    const realHourArray = dataArray.map((data) => Number(moment.utc(Number(data.time)).local().format('HH')));
    const missingHourArray = idealHourArray.filter((time) => {
      return !realHourArray.includes(time);
    });

    return dataArray.concat(missingHourArray.map((time) => ({
      time: startOfDayTimestampLocal + time * 60 * 60 * 1000,
    })));
  }

  combineYValue(dataArray) {
    let sortedDataArray = [];
    if (dataArray.length > 0) {
      sortedDataArray = dataArray.sort((a, b) => {
        return a.time - b.time;
      });
    }

    const combinedDataArray = [];
    for (let i = 0, len = sortedDataArray.length; i < len; i++) {
      if (sortedDataArray[i + 1] && sortedDataArray[i].time === sortedDataArray[i + 1].time) {
        combinedDataArray.push(Object.assign({}, sortedDataArray[i]), sortedDataArray[i + 1]);
        i++;
      } else {
        combinedDataArray.push(Object.assign({}, sortedDataArray[i]));
      }
    }
    return combinedDataArray;
  }

  render() {
    const { t } = this.props;
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <div className="top-area">
              <div className="nav-text">
                <span className="light">
                  {this.state.monitorType ? t(`${this.state.monitorType}Monitor`) : null}
                </span>
              </div>
            </div>

            <div className="gray-content-block second-block">
              <div className="filter-item inline">
                <a className="btn btn-default" onClick={this.refresh(this.state.period)}>
                  <i className={`fa fa-refresh ${this.props.context.loading ? 'fa-spin' : ''}`} />
                </a>
              </div>

              <div className="filter-item inline labels-filter">
                <div className="dropdown">
                  <button className="dropdown-menu-toggle" data-toggle="dropdown" type="button">
                    <span className="dropdown-toggle-text">{this.state.bucketName || t('pageResourceMonitors.chooseBucket')}</span>
                    <i className="fa fa-chevron-down" />
                  </button>

                  <div className="dropdown-menu dropdown-select dropdown-menu-selectable">
                    <div className="dropdown-content">
                      <ul>
                        {this.props.context.buckets && this.props.context.buckets.map((bucket) => {
                          return (
                            <li key={bucket.name}>
                              <a
                                className={this.state.bucketName === bucket.name ? 'is-active' : ''}
                                href
                                onClick={e => this.handleBucket(e, bucket.name)}
                              >
                                {bucket.name}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="inline">
                <span
                  style={{
                    marginLeft: 5,
                    padding: '6px 10px',
                    display: 'inline-block',
                  }}
                >
                {t('pageResourceMonitors.from')}
                </span>
                <div className="filter-item inline">
                  <DatePicker
                    dateFormat="YYYY/MM/DD"
                    minDate={this.state.startDateMinDate}
                    maxDate={this.state.startDateMaxDate}
                    className="dropdown-menu-toggle"
                    selected={this.state.startDate}
                    onChange={this.handleStartDate}
                  />
                </div>
                <span
                  style={{
                    padding: '6px 10px 6px 4px',
                    display: 'inline-block',
                  }}
                >
                {t('pageResourceMonitors.to')}
                </span>
                <div className="filter-item inline">
                  <DatePicker
                    dateFormat="YYYY/MM/DD"
                    minDate={this.state.endDateMinDate}
                    maxDate={this.state.endDateMaxDate}
                    className="dropdown-menu-toggle"
                    selected={this.state.endDate}
                    onChange={this.handleEndDate}
                  />
                </div>
              </div>

              <div className="filter-item inline pull-right">
                <div className="btn-group">
                  {this.periods.map((period) => {
                    return (
                      <a className={`btn ${period.id === this.state.period ? 'btn-info' : 'btn-default'}`} onClick={() => this.handlePeriod(period.id)} key={period.id}>
                        {period.name}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {this.props.context.initialized && React.cloneElement(this.props.children, {
              t: this.props.t,
              context: this.props.context,
              period: this.state.period,
              changeMonitorType: this.changeMonitorType,
              getCompleteTime: this.getCompleteTime,
              combineYValue: this.combineYValue,
              requestData: this.requestData,
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default attach(ResourceMonitorConsole);
