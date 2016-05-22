import React from 'react';
import RegionPage, { attach } from '../../shared/pages/RegionPage';

class C extends RegionPage {

  componentDidMount() {
  }

  render() {
    const { t } = this.props;
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <h3 className="page-title">
              {t('networkManage')}
            </h3>
            <hr />
            <div className="row with-info">
              <div className="col-md-3 info">
                <div className="panel panel-default">
                  <div className="panel-heading">基本信息</div>
                  <div className="panel-body">
                    <dl className="dl-horizontal">
                      <dt>ID</dt>
                      <dd>
                        <span className="id">i-u2lcu2fp</span>&nbsp;
                        <a className="btn-connect" href="#" title="Web 终端">
                          <span className="icon-instance"></span></a>
                      </dd>
                      <dt>名称</dt>
                      <dd>es-host-721121</dd>
                      <dt>标签</dt>
                      <dd>
                        <div data-id="tag-wmjllb0n">
                          <a className="resource-tag" data-tag-id="tag-wmjllb0n" id="color-tag-wmjllb0n">test</a>
                          <a className="btn-detach-tag icon-close" href="#"></a>
                        </div>
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
              </div>
              <div className="col-md-9">
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
