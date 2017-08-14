import React, { PropTypes } from 'react';
import MenuItem from './MenuItem';
import SubMenu from './SubMenu';
import './Menu.scss';

class Menu extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { children } = this.props;

    return (
      <ul className="menu">
        {children}
      </ul>
    );
  }
}

Menu.Item = MenuItem;
Menu.SubMenu = SubMenu;

Menu.defaultProps = {};

Menu.propTypes = {
  children: PropTypes.node,
};

export default Menu;
