import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

class C extends React.Component {
  componentDidMount() {
    const $ = require('jquery');

    $('.navbar-toggle').click(() => {
      $('.header-content .navbar-left').toggle();
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
              <i className="fa fa-bars"></i>
            </button>
            <div className="navbar-collapse collapse">
              <ul className="nav navbar-nav pull-right">
                <li>
                  <Link to="/profile">
                    <i className="fa fa-user fa-fw"></i>
                  </Link>
                </li>
                <li>
                  <Link className="logout" to="/logout">
                    <i className="fa fa-sign-out"></i>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <ul className="nav navbar-nav navbar-left">
                <li className="dropdown">
                  <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button">
                    <i className="fa fa-codepen"></i>&nbsp;
                    北京2区 <span className="caret"></span>
                  </a>
                  <ul className="dropdown-menu">
                    <li><Link to="/">北京1区</Link></li>
                    <li><Link to="/">广州2区</Link></li>
                    <li><Link to="/">香港1区</Link></li>
                  </ul>
                </li>
              </ul>
            </div>
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

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(C);
