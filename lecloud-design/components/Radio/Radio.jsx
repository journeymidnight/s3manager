import React, { PropTypes } from 'react';
import cx from 'classnames';
import './Radio.scss';

class Radio extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value: undefined,
    };

    this.onSelect = this.onSelect.bind(this);
  }

  componentWillMount() {
    const { options, defaultWord, onChange } = this.props;
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
      value: defaultOption.value,
    }, () => {
      if (onChange) {
        onChange(this.state.value);
      }
    });
  }

  onSelect(option) {
    const { onChange } = this.props;
    this.setState({
      value: option.value,
    }, () => {
      if (onChange) {
        onChange(this.state.value);
      }
    });
  }

  render() {
    const { type, options } = this.props;

    return (
      <div
        className={cx({
          radio: true,
          'radio-buttontype': type === 'button' || type === 'text',
          'radio-texttype': type === 'text' || type === 'default',
        })}
      >
        {
          options.map((option, key) => {
            let color = 'transparent';
            if (type === 'button' || type === 'text') {
              color = 'white';
              if (this.state.value === option.value) {
                color = 'blue';
              }
            }

            return (
              <button
                key={key}
                type="button"
                className={cx({
                  button: true,
                  [`button-${color}`]: true,
                  'radio-checked': this.state.value === option.value,
                })}
                onClick={() => this.onSelect(option)}
              >
                <i
                  className={cx({
                    iconfont: true,
                    'radio-icon': true,
                    'icon-radio_selected': this.state.value === option.value,
                    'icon-radio': this.state.value !== option.value,
                  })}
                />
                {option.name || option.value}
              </button>
            );
          })
        }
      </div>
    );
  }
}

Radio.defaultProps = {
  type: 'default',
};

Radio.propTypes = {
  type: PropTypes.oneOf(['default', 'button', 'text']),
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  defaultWord: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func,
};

export default Radio;
