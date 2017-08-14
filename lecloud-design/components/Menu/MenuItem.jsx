import React, { PropTypes } from 'react';
import './Menu.scss';

class MenuItem extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { children } = this.props;

    return (
      <li className="menuitem">
        {children}
      </li>
    );
  }
}

MenuItem.defaultProps = {};

MenuItem.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
};

export default MenuItem;
