import React from 'react';
import Page from '../../../shared/pages/Page';
import * as Actions from '../../redux/actions';

class C extends Page {

  constructor(props) {
    super(props);

    const { t } = this.props;

    this.periods = [{
      id: '120mins',
      duration: 60 * 60 * 2,
      name: t('boss.monitor.periods.120mins'),
    }, {
      id: '720mins',
      duration: 60 * 60 * 12,
      name: t('boss.monitor.periods.720mins'),
    }, {
      id: '48hours',
      duration: 60 * 60 * 24 * 2,
      name: t('boss.monitor.periods.48hours'),
    }, {
      id: '14days',
      duration: 60 * 60 * 24 * 7,
      name: t('boss.monitor.periods.14days'),
    }, {
      id: '30days',
      duration: 60 * 60 * 24 * 30,
      name: t('boss.monitor.periods.30days'),
    }];

    this.state = {
      period: undefined,
    };

    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    this.refresh('120mins')();
  }

  getMonitorData() {
  }

  refresh(period) {
    return (e) => {
      if (e) {
        e.preventDefault();
      }

      const { dispatch, routerKey, region2 } = this.props;

      this.getMonitorData(dispatch, routerKey, region2, period)
      .then(() => {
        dispatch(Actions.extendContext({ loading: false }, routerKey));
      });

      this.setState({ period });

      dispatch(Actions.extendContext({ loading: true }, routerKey));
    };
  }

  renderMonitor() {
  }

  render() {
    return (
      <div className="content">
        <div className="clearfix">

          <div className="gray-content-block second-block">
            <div className="filter-item inline">
              <a className="btn btn-default" onClick={this.refresh(this.state.period)}>
                <i className={`fa fa-refresh ${this.props.context.loading ? 'fa-spin' : ''}`}></i>
              </a>
            </div>
            <div className="filter-item inline pull-right">
              <div className="btn-group">
                {this.periods.map((period) => {
                  return (
                    <a className={`btn ${period.id === this.state.period ? 'btn-info' : 'btn-default'}`} onClick={this.refresh(period.id)} key={period.id}>
                      {period.name}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {this.renderMonitor()}
        </div>
      </div>
    );
  }
}

export default C;
