import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Link } from 'react-router';

class C extends React.Component {
  componentDidMount() {
    const $ = require('jquery');

    $('.navbar-toggle').click(() => {
      $('.navbar-brand').toggle();
      $('.header-content .navbar-collapse').toggle();
      $('.navbar-toggle').toggleClass('active');
    });
  }
  render() {
    const { t } = this.props;
    const { header } = this.props.context;
    return (
      <header className="header-expanded navbar navbar-fixed-top navbar-gitlab">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src="/asset/lecloud.white.svg" alt="logo" />
          </Link>
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
                  <h1 className="title">
                    <i className="fa fa-codepen"></i>&nbsp;
                    <Link to="/" >
                      {this.props.region.name}
                    </Link>
                    {this.props.regions.length > 1 &&
                      <i data-target=".js-dropdown-menu-projects" data-toggle="dropdown" className="fa fa-chevron-down dropdown-toggle-caret js-projects-dropdown-toggle" />
                    }
                    {header && header.title && ' · '}
                    {header && header.title &&
                      <Link className="project-item-select-holder" to={header.link}>{header.title}</Link>
                    }
                    {this.props.regions.length > 1 &&
                      <div className="js-dropdown-menu-projects">
                        <div className="dropdown-menu">
                          <div className="dropdown-title">
                            <span>{t('selectRegion')}</span>
                            <button className="dropdown-title-button dropdown-menu-close" aria-label="Close" type="button">
                              <i className="fa fa-times dropdown-menu-close-icon"></i>
                            </button>
                          </div>
                          <div className="dropdown-content">
                            <ul>
                              {this.props.regions.map((region) => {
                                if (region.regionId !== this.props.region.regionId) {
                                  return <li key={region.regionId}><Link to={`/${region.regionId}/instances`}>{region.name}</Link></li>;
                                }
                                return <li key={region.regionId} />;
                              })}
                            </ul>
                          </div>
                          <div className="dropdown-loading">
                            <i className="fa fa-spinner fa-spin"></i>
                          </div>
                        </div>
                      </div>
                    }
                  </h1>
                </li>
                <li>
                  <Link to="/profile">
                    piaoyuankui
                    <i data-target=".js-dropdown-menu-projects" data-toggle="dropdown" className="fa fa-chevron-down dropdown-toggle-caret js-projects-dropdown-toggle" />
                  </Link>
                  <div className="js-dropdown-menu-projects">
                    <div className="dropdown-menu">
                      <div className="dropdown-title">
                        <span>{t('selectRegion')}</span>
                        <button className="dropdown-title-button dropdown-menu-close" aria-label="Close" type="button">
                          <i className="fa fa-times dropdown-menu-close-icon"></i>
                        </button>
                      </div>
                      <div className="dropdown-content">
                        <ul>
                          <li><Link to="/profile">profile</Link></li>
                          <li><Link to="/billing">billing</Link></li>
                          <li><Link to="/logout">logout</Link></li>
                        </ul>
                      </div>
                      <div className="dropdown-loading">
                        <i className="fa fa-spinner fa-spin"></i>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="dropdown">
                  <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button">
                    piaoyuankui <span className="caret"></span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-right">
                    <li><a href="#">Action</a></li>
                    <li><a href="#">Another action</a></li>
                    <li><a href="#">Something else here</a></li>
                    <li role="separator" className="divider"></li>
                    <li><a href="#">Separated link</a></li>
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
