import React from 'react';
import './NumericTextBox.scss';

class NumericTextBox extends React.Component {
  static handleEnterPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      return false;
    }
    return true;
  }

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.min = props.min;
    this.max = props.max;
    this.step = props.step;
    this.state = { value: props.value };
    this.refInput = null;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.value });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.value !== this.state.value;
  }

  checkAndAdjustValue(value) {
    let result = value;
    if (isNaN(value) || value <= this.min) {
      result = this.min;
    } else if (value >= this.max) {
      result = this.max;
    } else if (value % this.step !== 0) {
      result = Math.ceil(value / this.step) * this.step;
    }

    return result;
  }

  handleChange() {
    this.setState({ value: this.refInput.value });
    setTimeout(() => {
      const value = this.checkAndAdjustValue(Number(this.refInput.value.trim()));
      this.setState({ value });
      this.props.onChange(value);
    }, 1500);
  }

  handleClick(event) {
    event.preventDefault();
    const target = event.target;
    const oldValue = Number(this.refInput.value.trim());
    let value = oldValue;
    if (target.className === 'action-puls') {
      value = this.checkAndAdjustValue(oldValue + this.step);
    } else if (target.className === 'action-subtract') {
      value = this.checkAndAdjustValue(oldValue - this.step);
    }
    this.setState({ value });
    this.props.onChange(value);
  }

  handleBlur() {
    const value = this.checkAndAdjustValue(Number(this.refInput.value.trim()));
    this.setState({ value });
    this.props.onChange(value);
  }

  render() {
    const value = this.state.value;
    return (
      <div className="numeric-text-box">
        <input
          className="input"
          ref={(ref) => { this.refInput = ref; }}
          value={value}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onKeyPress={this.handleEnterPress}
        />
        <div className="numeric-text-actions" >
          <button className="action-puls" onClick={this.handleClick} />
          <button className="action-subtract" onClick={this.handleClick} />
        </div>
      </div>
    );
  }
}

NumericTextBox.propTypes = {
  min: React.PropTypes.number,
  max: React.PropTypes.number,
  step: React.PropTypes.number,
  value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
  onChange: React.PropTypes.func,
};

export default NumericTextBox;
