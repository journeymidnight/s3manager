import React from 'react';
import { connect } from 'react-redux';
import * as TenantActions from '../redux/actions.tenant';
import TenantForm from '../forms/TenantForm';

class C extends React.Component {

  componentDidMount() {
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(values, dispatch) {
    return new Promise((resolve, reject) => {
      const name = values.name;
      const description = values.description;

      dispatch(TenantActions.requestCreateTenant({
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
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <h3 className="page-title">
              添加租户
            </h3>
            <hr />
            <TenantForm onSubmit={this.onSubmit} />
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
