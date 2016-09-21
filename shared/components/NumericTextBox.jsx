import React from 'react';


class NumericTextBox extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.min = props.min;
    this.max = props.max;
    this.step = props.step;
    this.state = { value: props.value };
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
    this.setState({ value: this.refs.myInput.value });
    setTimeout(() => {
      const value = this.checkAndAdjustValue(Number(this.refs.myInput.value.trim()));
      this.setState({ value });
      this.props.onChange(value);
    }, 1500);
  }

  handleClick(event) {
    const target = event.target;
    const oldValue = Number(this.refs.myInput.value.trim());
    let value = oldValue;
    if (target.className === 'upTriangle') {
      value = this.checkAndAdjustValue(oldValue + this.step);
    } else if (target.className === 'downTriangle') {
      value = this.checkAndAdjustValue(oldValue - this.step);
    }
    this.setState({ value });
    this.props.onChange(value);
  }

  render() {
    const value = this.state.value;
    return (
      <div className="numericTextBox">
        <input className="form-control" ref="myInput" onChange={this.handleChange} value={value} />
        <div className="clickDiv" onClick={this.handleClick}>
          <div className="upTriangle" />
          <div className="downTriangle" />
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
