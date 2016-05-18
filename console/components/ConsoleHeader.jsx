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
              {this.props.regions.length === 1 &&
                <ul className="nav navbar-nav navbar-left">
                  <li>
                    <Link to="/" >
                      <i className="fa fa-codepen"></i>&nbsp;
                      {this.props.region.name}
                    </Link>
                  </li>
                </ul>
              }
              {this.props.regions.length > 1 &&
                <ul className="nav navbar-nav navbar-left">
                  <li className="dropdown">
                    <Link to="/" className="dropdown-toggle" data-toggle="dropdown" >
                      <i className="fa fa-codepen"></i>&nbsp;
                      {this.props.region.name} <span className="caret"></span>
                    </Link>
                    <ul className="dropdown-menu">
                      {this.props.regions.map((region) => {
                        if (region.regionId !== this.props.region.regionId) {
                          return <li key={region.regionId}><Link to={`/${region.regionId}/instances`}>{region.name}</Link></li>;
                        }
                        return <li key={region.regionId} />;
                      })}
                    </ul>
                  </li>
                </ul>
              }
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
  region: React.PropTypes.object,
  regions: React.PropTypes.array,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    region: state.region,
    regions: state.regions,
  };
}

export default connect(mapStateToProps)(C);
