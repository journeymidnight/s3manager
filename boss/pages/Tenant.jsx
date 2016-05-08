import React from 'react';
import { connect } from 'react-redux';

const C = (props) => {
  const tenant = props.context.tenant;
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
          <form className="form-horizontal" acceptCharset="UTF-8" method="post">
            <div className="form-group">
              <label className="control-label" forHtml="service_active">
                Active
              </label>
              <div className="col-sm-10">
                <input name="service[active]" type="hidden" value="0" />
                <input type="checkbox" value="1" name="service[active]" />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label" forHtml="service_token">
                Token
              </label>
              <div className="col-sm-10">
                <input className="form-control" placeholder="" type="text" name="service[token]" />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label" forHtml="service_subdomain">
                Subdomain
              </label>
              <div className="col-sm-10">
                <input className="form-control" placeholder="" type="text" name="service[subdomain]" />
              </div>
            </div>
            <div className="form-actions">
              <input type="submit" name="commit" value="Save changes" className="btn btn-save" />
              &nbsp;
              <a className="btn btn-cancel" href="/lestack/lestack-ui/services">
                Cancel
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

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
