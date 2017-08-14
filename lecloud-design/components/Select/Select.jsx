import React, { PropTypes } from 'react';
import cx from 'classnames';
import _ from 'lodash';
import './Select.scss';

class Select extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: undefined,
      value: undefined,
      isClosed: true,
    };

    this.onClick = this.onClick.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  componentWillMount() {
    const { options, onChange, defaultWord } = this.props;
    let defaultOption;
    if (defaultWord) {
      const defaultOptionIndex = options.findIndex(item => item.name === defaultWord || item.value === defaultWord);
      if (defaultOptionIndex > -1) {
        defaultOption = options[defaultOptionIndex];
      }
    } else {
      defaultOption = options[0];
    }
    this.setState({
      name: defaultOption.name,
      value: defaultOption.value,
      isClosed: true,
    }, () => {
      if (onChange) {
        onChange(this.state.value);
      }
    });
  }

  onClick() {
    this.setState({
      isClosed: !this.state.isClosed,
    });
  }

  onSelect(option) {
    const { onChange } = this.props;
    this.setState({
      name: option.name,
      value: option.value,
      isClosed: true,
    }, () => {
      if (onChange) {
        onChange(this.state.value);
      }
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
    const { name, autoFocus, options } = this.props;

    return (
      <div
        className={cx({
          select: true,
          'select-closed': this.state.isClosed,
        })}
      >
        <button
          className="select-button"
          name={name}
          type="button"
          autoFocus={autoFocus}
          onClick={this.onClick}
          onBlur={this.onBlur}
        >
          {this.state.name || this.state.value}

          <i
            className={cx({
              iconfont: true,
              'select-icon': true,
              'icon-arrow_down': this.state.isClosed,
              'icon-arrow_up': !this.state.isClosed,
            })}
          />
        </button>

        <ul className="select-options">
          {options.map((option, key) => {
            return (
              <li
                key={key}
                className="select-option"
              >
                <a
                  href
                  className={cx({
                    'select-highlight': _.isEqual(this.state.value, option.value),
                  })}
                  onClick={(e) => {
                    e.preventDefault();
                    this.onSelect(option);
                  }}
                >
                  {option.name || option.value}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

Select.defaultProps = {};

Select.propTypes = {
  name: PropTypes.string,
  autoFocus: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  defaultWord: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  onChange: PropTypes.func,
};

export default Select;
