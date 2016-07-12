import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Link } from 'react-router';

class C extends React.Component {
  componentDidMount() {
  }

  render() {
    const { header } = this.props.context;
    return (
      <header className="header-expanded navbar navbar-fixed-top navbar-gitlab">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src="/asset/logo.white.svg" alt="logo" />
          </Link>
          <div className="header-content">
            <div className="navbar-left">
              <ul className="nav navbar-nav">
                <li className="dropdown">
                  <a href="#" className="dropdown-toggle" role="button">
                    产品和服务 <span className="caret"></span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-right">
                    <li><a href="#">云主机</a></li>
                    <li><a href="#">云存储</a></li>
                  </ul>
                </li>
              </ul>
            </div>
            <div className="navbar-collapse collapse">
              <ul className="nav navbar-nav pull-right">
                <li className="hidden">
                  <h1 className="title">
                    {header && header.title &&
                      <Link className="project-item-select-holder" to={header.link}>{header.title}</Link>
                    }
                  </h1>
                </li>
                <li className="dropdown">
                  <a href="#" className="dropdown-toggle" role="button">
                    <i className="fa fa-codepen"></i>&nbsp;
                    华北一区 <span className="caret"></span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-right">
                    <li><a href="#">华北2区</a></li>
                    <li><a href="#">美国1区</a></li>
                  </ul>
                </li>
                <li className="dropdown">
                  <a href="#" className="dropdown-toggle" role="button">
                    piaoyuankui <span className="caret"></span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-right">
                    <li><a href="#">Action</a></li>
                    <li><a href="#">Another action</a></li>
                    <li role="separator" className="divider"></li>
                    <li><a href="#">One more separated link</a></li>
                  </ul>
                </li>
                <li>
                  <Link className="logout" to="/logout">
                    <i className="fa fa-sign-out"></i>
                  </Link>
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
  t: React.PropTypes.any,
  auth: React.PropTypes.object,
  region: React.PropTypes.object,
  regions: React.PropTypes.array,
  context: React.PropTypes.object,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    region: state.region,
    regions: state.regions,
    context: state.context,
  };
}

export default connect(mapStateToProps)(translate()(C));
