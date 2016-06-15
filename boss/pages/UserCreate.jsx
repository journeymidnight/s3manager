import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import * as Actions from '../redux/actions';
import UserForm from '../forms/UserForm';

class C extends React.Component {

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('userManage'), '/users'));
  }

  onSubmit(values, dispatch) {
    return new Promise((resolve, reject) => {
      const username = values.username;
      const email = values.email;
      const password = values.password;

      dispatch(Actions.requestCreateUser({
        username,
        email,
        password,
      }))
      .then(() => {
        resolve();
      }).catch((error) => {
        reject({ _error: error.message });
      });
    });
  }

  render() {
    const { t } = this.props;
    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">

            <div className="top-area append-bottom-20">
              <div className="nav-text">
                <span className="light">
                  {t('create') + t('user')}
                </span>
              </div>
            </div>

            <UserForm onSubmit={this.onSubmit} />
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
