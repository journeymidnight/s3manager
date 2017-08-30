import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Link } from 'react-router';
import { Dropdown, Menu} from '../../lecloud-design';

class C extends React.Component {
  componentDidMount() {
    const $ = require('jquery');

    $('.navbar-toggle').click(() => {
      $('.header-content .title').toggle();
      $('.header-content .navbar-collapse').toggle();
      $('.navbar-toggle').toggleClass('active');
    });
  }

  clickme(){
    alert("hehe")
  }

  constructor(props) {
    super(props)

    this.clickme = this.clickme.bind(this)
  }
  render() {
    const { t } = this.props;
    const { header } = this.props.context;
    const { regionSet } = this.props.consoleheader;
    let regionswitcher = null
    if (this.props.auth.username !== 'u-root') {
      regionswitcher = (
        <div className="dropdown inline prepend-left-10">
                <button className="dropdown-toggle btn" data-toggle="dropdown" type="button" style={{marginTop: 16, padding: 2}}>
                  {"切换区域"}
                  <b className="caret"></b></button>
                <ul className="dropdown-menu dropdown-menu-align-right dropdown-select dropdown-menu-selectable">
                  {regionSet.map((_region) => {
                    return (
                      <li
                        key={_region.regionId}
                      >
                        <a href={_region.endpoint} onClick={this.clickme}>
                          {_region.regionName}
                        </a>
                      </li>
                    );
                    })}
                </ul>
        </div>)
    }

    return (
      <header className="header-expanded navbar navbar-fixed-top navbar-gitlab">
        <div className="container-fluid">
          <div className="header-content">
            <button className="navbar-toggle" type="button">
              <i className="fa fa-bars">
              </i>
            </button>
            <div className="navbar-collapse collapse">
              <ul className="nav navbar-nav pull-right">
                <li>
                  {regionswitcher}
                </li>
                <li>
                  <Link className="logout" to="/logout">
                    <i className="fa fa-sign-out"></i>
                  </Link>
                </li>
              </ul>
            </div>
            <h1 className="title">
              <Link to="/">{t('boss.title')}</Link>
              {header && header.title && ' · '}
              {header && header.title &&
                <Link className="project-item-select-holder" to={header.link}>{header.title}</Link>
              }
            </h1>
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
  context: React.PropTypes.object,
  consoleheader : React.PropTypes.object,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    context: state.context,
    consoleheader: state.consoleheader,
  };
}

export default connect(mapStateToProps)(translate()(C));
