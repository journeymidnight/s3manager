import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions';
import TenantForm from '../forms/TenantForm';

class C extends React.Component {

  componentDidMount() {
    const { params, dispatch } = this.props;

    this.tenantId = params.tenantId;
    dispatch(Actions.requestDescribeTenant(this.tenantId));

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(values, dispatch) {
    return new Promise((resolve, reject) => {
      const name = values.name;
      const description = values.description;

      dispatch(Actions.requestModifyTenant({
        tenantId: this.tenantId,
        name,
        description,
      }))
      .then(() => {
        resolve();
      }).catch((error) => {
        reject({ _error: error.message });
      });
    });
  }

  render() {
    const tenant = this.props.context.tenant;
    if (tenant === undefined) {
      return <div />;
    }

    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <h3 className="page-title">
              租户 {tenant.name}
            </h3>
            <hr />
            <TenantForm initialValues={tenant} onSubmit={this.onSubmit} />
          </div>
        </div>
      </div>
    );
  }
}

C.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  context: React.PropTypes.object,
  params: React.PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    context: state.context,
  };
}

export default connect(mapStateToProps)(C);
