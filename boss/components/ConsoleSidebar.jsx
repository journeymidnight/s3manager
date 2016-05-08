import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import NavLink from '../../shared/components/NavLink';

class C extends React.Component {
  componentDidMount() {
    const $ = require('jquery');

    $('.nicescroll')
    .niceScroll({
      cursoropacitymax: '0.4',
      cursorcolor: '#FFF',
      cursorborder: '1px solid #FFF',
    });

    const collapsed = 'page-sidebar-collapsed';
    const expanded = 'page-sidebar-expanded';

    $('.toggle-nav-collapse').click(() => {
      $('.page-with-sidebar').toggleClass(`${collapsed} ${expanded}`);
      $('header').toggleClass('header-collapsed header-expanded');
      $('.toggle-nav-collapse i').toggleClass('fa-angle-right fa-angle-left');

      setTimeout(() => {
        const niceScrollBars = $('.nicescroll').niceScroll();
        niceScrollBars.updateScrollBar();
      }, 300);
    });
  }

  render() {
    return (
      <div className="nicescroll sidebar-expanded sidebar-wrapper" tabIndex="0">
        <div className="header-logo">
          <Link to="/">
            <img width="32" height="32" src="/asset/logo.svg" alt="logo" />
          </Link>
          <Link className="gitlab-text-container-link" to="/">
            <div className="gitlab-text-container">
              <h3>LeStack</h3>
            </div>
          </Link>
        </div>
        <ul className="nav nav-sidebar">
          <li className="hidden">
            <a className="back-link" href="/groups/lestack">
              <i className="fa fa-caret-square-o-left fa-fw">
              </i>
              <span>
                Go to group
              </span>
            </a>
          </li>
          <NavLink to="/tenants">
            <i className="fa fa-cube fa-fw" />
            <span>租户</span>
          </NavLink>
          <NavLink to="/users">
            <i className="fa fa-user fa-fw" />
            <span>用户</span>
          </NavLink>
        </ul>
        <div className="collapse-nav">
          <a className="toggle-nav-collapse" href="#">
            <i className="fa fa-angle-left">
            </i>
          </a>
        </div>
      </div>
    );
  }
}

C.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  auth: React.PropTypes.object,
  routing: React.PropTypes.object,
};

function mapStateToProps(store) {
  return {
    auth: store.auth,
    routing: store.routing,
  };
}

export default connect(mapStateToProps)(C);
