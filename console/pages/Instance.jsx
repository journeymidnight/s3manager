import React from 'react';
import RegionPage, { attach } from '../../shared/pages/RegionPage';
import * as InstanceActions from '../redux/actions.instance';

class C extends RegionPage {

  constructor(props) {
    super(props);
    this.startInstance = this.startInstance.bind(this);
    this.stopInstance = this.stopInstance.bind(this);
  }

  componentDidMount() {
    const { dispatch, region, routerKey, params } = this.props;

    this.instanceId = params.instanceId;
    dispatch(InstanceActions.requestDescribeInstance(routerKey, region.regionId, this.instanceId));

    this.setInterval(() => {
      dispatch(InstanceActions.requestDescribeInstance(routerKey, region.regionId, this.instanceId));
    }, 2000);
  }

  startInstance() {
    const { dispatch, region, routerKey } = this.props;

    dispatch(InstanceActions.requestStartInstance(routerKey, region.regionId, this.instanceId));
  }

  stopInstance() {
    const { dispatch, region, routerKey } = this.props;

    dispatch(InstanceActions.requestStopInstance(routerKey, region.regionId, this.instanceId));
  }

  render() {
    const { t } = this.props;
    const instance = this.props.context.instance;

    if (!instance) {
      return <div />;
    }

    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <h3 className="page-title">
              {t('networkManage')}
            </h3>
            <hr />
            <div className="row with-info">
              <div className="col-md-4 info">
                <div className="panel panel-default">
                  <div className="panel-heading">基本信息</div>
                  <div className="panel-body">
                    <dl className="dl-horizontal">
                      <dt>ID</dt>
                      <dd>{instance.instanceId}</dd>
                      <dt>名称</dt>
                      <dd>{instance.name}</dd>
                      <dt>状态</dt>
                      <dd>
                        <span className={`i-status i-status-${instance.status}`}>
                          <i className="icon"></i>
                          {t(`instanceStatus.${instance.status}`)}
                        </span>
                      </dd>
                      <dt>描述</dt>
                      <dd></dd>
                      <dt>状态</dt>
                      <dd className="running">运行中</dd>
                      <dt>创建时间</dt>
                      <dd className="time">2015-12-22 16:59:26</dd>
                      <dt>创建于</dt>
                      <dd className="time">5 个月前</dd>
                    </dl>
                  </div>
                </div>
                <div className="panel panel-default">
                  <div className="panel-heading">基本信息</div>
                  <div className="panel-body">
                    <button type="button" className="btn" disabled={instance.status !== 'stopped'} onClick={this.startInstance}>
                      开机
                    </button>
                    <button type="button" className="btn" disabled={instance.status !== 'active'} onClick={this.stopInstance}>
                      关机
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <ul className="nav-links">
                  <li className="home active">
                    <a data-placement="right" href="#">{t('pageNetwork.subnet')}</a>
                  </li>
                  <li className="">
                    <a data-placement="right" href="#">{t('pageNetwork.router')}</a>
                  </li>
                </ul>
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Username</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">1</th>
                      <td>Mark</td>
                      <td>Otto</td>
                      <td>@mdo</td>
                    </tr>
                    <tr>
                      <th scope="row">2</th>
                      <td>Jacob</td>
                      <td>Thornton</td>
                      <td>@fat</td>
                    </tr>
                    <tr>
                      <th scope="row">3</th>
                      <td>Larry</td>
                      <td>the Bird</td>
                      <td>@twitter</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default attach(C);
