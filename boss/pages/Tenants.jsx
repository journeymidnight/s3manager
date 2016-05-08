import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions';

class C extends React.Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(Actions.requestDescribeTenants());
  }

  render() {
    const tenants = this.props.context.tenantSet && this.props.context.tenantSet.map((tenant) => {
      return (
        <tr key={tenant.id}>
          <td>{tenant.id}</td>
          <td>
            <Link to={`/tenants/${tenant.id}`}>
              <strong>
                {tenant.name}
              </strong>
            </Link>
          </td>
          <td>{tenant.description}</td>
          <td className="light">{tenant.created}</td>
        </tr>
      );
    });
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <h3 className="page-title">
              租户管理
            </h3>
            <div className="top-area">
              <div className="nav-text">
                <p className="light">
                可根据不同的企业或团队划分独立的租户, 分配相应的资源配额。
                </p>
              </div>
              <div className="nav-controls">
                <Link className="btn btn-new" to="/tenants/new">
                  <i className="fa fa-plus"></i>&nbsp;添加
                </Link>
              </div>
            </div>
            <div className="table-holder">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>名称</th>
                    <th>描述</th>
                    <th>创建时间</th>
                  </tr>
                </thead>
                <tbody>
                {tenants}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

C.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  context: React.PropTypes.object,
};

function mapStateToProps(state) {
  return {
    context: state.context,
  };
}

export default connect(mapStateToProps)(C);
