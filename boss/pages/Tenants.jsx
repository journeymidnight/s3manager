import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import * as TenantActions from '../redux/actions.tenant';

class C extends React.Component {

  componentDidMount() {
    const { dispatch, routerKey } = this.props;
    dispatch(TenantActions.requestDescribeTenants(routerKey));
  }

  render() {
    const tenants = this.props.context.tenantSet && this.props.context.tenantSet.map((tenant) => {
      return (
        <tr key={tenant.tenantId}>
          <td>{tenant.tenantId}</td>
          <td>
            <Link to={`/tenants/${tenant.tenantId}`}>
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
    const { t } = this.props;
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <h3 className="page-title">
              {t('tenantManage')}
            </h3>
            <div className="top-area">
              <div className="nav-text">
                <p className="light">
                  {t('tenantManageDescription')}
                </p>
              </div>
              <div className="nav-controls">
                <Link className="btn btn-new" to="/tenants/new">
                  <i className="fa fa-plus"></i>&nbsp;{t('add')}
                </Link>
              </div>
            </div>
            <div className="table-holder">
              <table className="table">
                <thead>
                  <tr>
                    <th>{t('id')}</th>
                    <th>{t('name')}</th>
                    <th>{t('description')}</th>
                    <th>{t('created')}</th>
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
  t: React.PropTypes.any,
  routerKey: React.PropTypes.string,
};

function mapStateToProps(state) {
  return {
    context: state.context,
    routerKey: state.routing.locationBeforeTransitions.key,
  };
}

export default connect(mapStateToProps)(translate()(C));
