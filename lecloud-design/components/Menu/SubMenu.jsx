import React, { PropTypes } from 'react';
import cx from 'classnames';
import './Menu.scss';

class SubMenu extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isClosed: true,
    };

    this.onClick = this.onClick.bind(this);
    this.onOpen = this.onOpen.bind(this);
  }

  onClick(e) {
    e.stopPropagation();
    this.setState({
      isClosed: !this.state.isClosed,
    });
  }

  onOpen() {
    this.setState({
      isClosed: false,
    });
  }

  render() {
    const { text, children } = this.props;

    return (
      <li
        className={cx({
          submenu: true,
          'submenu-closed': this.state.isClosed,
        })}
        onClick={this.onOpen}
      >
        {text}
        <i
          className={cx({
            iconfont: true,
            'submenu-icon': true,
            'icon-arrow_down': this.state.isClosed,
            'icon-arrow_up': !this.state.isClosed,
          })}
          onClick={e => this.onClick(e)}
        />

        <ul
          className={cx({
            'submenu-items': true,
            'submenu-closed': this.state.isClosed,
          })}
        >
          {children}
        </ul>
      </li>
    );
  }
}

SubMenu.defaultProps = {};

SubMenu.propTypes = {
  text: PropTypes.node,
  path: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
};

export default SubMenu;
