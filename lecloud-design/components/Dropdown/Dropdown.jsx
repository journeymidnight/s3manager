import React, { PropTypes } from 'react';
import cx from 'classnames';
import './Dropdown.scss';

class Dropdown extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isClosed: true,
    };

    this.onClick = this.onClick.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onClick() {
    this.setState({
      isClosed: !this.state.isClosed,
    });
  }

  onBlur() {
    setTimeout(() => {
      if (!this.state.isClosed) {
        this.setState({
          isClosed: true,
        });
      }
    }, 200);
  }

  render() {
    const { text, type, align, trigger, autoFocus, children } = this.props;
    let iconType;
    if (text.length === 0) {
      iconType = 'option';
    } else if (this.state.isClosed) {
      iconType = 'arrow_down';
    } else {
      iconType = 'arrow_up';
    }

    return (
      <div
        className={cx({
          dropdown: true,
          'dropdown-closed': this.state.isClosed,
          'dropdown-hovertrigger': trigger === 'hover',
        })}
      >
        <button
          className={cx({
            'dropdown-button': true,
            'dropdown-buttontype': type === 'button',
            'dropdown-empty': text.length === 0,
          })}
          type="button"
          autoFocus={autoFocus}
          onClick={type === 'button' ? this.onClick : null}
          onBlur={type === 'button' ? this.onBlur : null}
        >
          {text}

          <i className={cx('iconfont', 'dropdown-icon', `icon-${iconType}`)} />
        </button>

        <div
          className={cx({
            'dropdown-menu-own': true,
            'dropdown-right': align === 'right',
          })}
        >
          {children}
        </div>
      </div>
    );
  }
}

Dropdown.defaultProps = {
  text: '',
  type: 'default',
  align: 'left',
  trigger: 'hover',
};

Dropdown.propTypes = {
  text: PropTypes.node,
  type: PropTypes.oneOf(['default', 'button']),
  align: PropTypes.oneOf(['left', 'right']),
  trigger: PropTypes.oneOf(['hover', 'click']),
  autoFocus: PropTypes.bool,
  children: PropTypes.node,
};

export default Dropdown;
