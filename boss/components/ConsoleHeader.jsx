import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

class C extends React.Component {
  componentDidMount() {
    const $ = require('jquery');

    $('.navbar-toggle').click(() => {
      $('.header-content .title').toggle();
      $('.header-content .navbar-collapse').toggle();
      $('.navbar-toggle').toggleClass('active');
    });
  }
  render() {
    return (
      <header className="header-expanded navbar navbar-fixed-top navbar-gitlab">
        <div className="container-fluid">
          <div className="header-content">
            <button className="navbar-toggle" type="button">
              <span className="sr-only">
                Toggle navigation
              </span>
              <i className="fa fa-bars">
              </i>
            </button>
            <div className="navbar-collapse collapse">
              <ul className="nav navbar-nav pull-right">
                <li>
                  <Link className="logout" title="Sign out" to="/logout">
                    <i className="fa fa-sign-out">
                    </i>
                  </Link>
                </li>
              </ul>
            </div>
            <h1 className="title">
            </h1>
          </div>
        </div>
      </header>
    );
  }
}

C.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  auth: React.PropTypes.object,
};

function mapStateToProps(store) {
  return {
    auth: store.auth,
  };
}

export default connect(mapStateToProps)(C);
