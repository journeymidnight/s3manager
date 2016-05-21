import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import * as Actions from '../redux/actions';

class C extends React.Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(Actions.requestDescribeUsers());
  }

  render() {
    const { t } = this.props;
    const users = this.props.context.userSet && this.props.context.userSet.map((user) => {
      return (
        <tr key={user.userId}>
          <td>{user.userId}</td>
          <td>
            <Link to={`/users/${user.userId}`}>
              <strong>
                {user.username}
              </strong>
            </Link>
          </td>
          <td>{user.email}</td>
          <td className="light">{user.created}</td>
        </tr>
      );
    });
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <h3 className="page-title">
              {t('userManage')}
            </h3>
            <div className="top-area">
              <div className="nav-text">
                <p className="light">
                  {t('userManageDescription')}
                </p>
              </div>
              <div className="nav-controls">
                <Link className="btn btn-new" to="/users/create">
                  <i className="fa fa-plus"></i>&nbsp;{t('create')}
                </Link>
              </div>
            </div>
            <div className="table-holder">
              <table className="table">
                <thead>
                  <tr>
                    <th>{t('id')}</th>
                    <th>{t('username')}</th>
                    <th>{t('email')}</th>
                    <th>{t('created')}</th>
                  </tr>
                </thead>
                <tbody>
                {users}
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
};

function mapStateToProps(state) {
  return {
    context: state.context,
  };
}

export default connect(mapStateToProps)(translate()(C));
