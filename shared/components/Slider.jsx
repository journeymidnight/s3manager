import React from 'react';

class Slider extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.min = this.props.min;
    this.max = this.props.max;
    this.step = this.props.step;
    this.atomicWidth = 300 / this.max;
    this.atomicValue = 1 / this.atomicWidth;
    this.state = {
      value: this.props.value,
    };
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

  calcSelectionWidth(originalValue) {
    const value = Number(originalValue);
    if (isNaN(value) || value <= this.min) {
      return this.min * this.atomicWidth;
    } else if (value >= this.max) {
      return this.max * this.atomicWidth;
    }
    return value * this.atomicWidth;
  }

  handleMouseDown() {
    const sliderBar = this.refs.sliderBar;
    const that = this;

    document.onmousemove = (event) => {
      const originalValue = (event.pageX - sliderBar.getBoundingClientRect().left) * that.atomicValue;
      const value = this.checkAndAdjustValue(originalValue);
      this.setState({ value });
      this.props.onChange(value);
    };
    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  }

  handleChange() {
    this.setState({ value: this.refs.myInput.value });
    setTimeout(() => {
      const value = this.checkAndAdjustValue(Number(this.refs.myInput.value.trim()));
      this.setState({ value });
      this.props.onChange(value);
    }, 1500);
  }

  render() {
    const value = this.state.value;
    return (
      <div className="slider-container">
        <div className="slider slider-horizontal" ref="slider">
          <div className="slider-track" ref="bar">
            <div className="slider-selection" ref="sliderBar" style={{ width: this.calcSelectionWidth(value).toString().concat('px') }} />
            <div
              className="slider-handle round"
              ref="sliderDot" onMouseDown={this.handleMouseDown}
              style={{ left: (this.calcSelectionWidth(value) + 4).toString().concat('px') }}
            />
          </div>
        </div>
        <input type="text" className="form-control preview mini" value={value} ref="myInput" onChange={this.handleChange} />
        <span className="help inline">GB</span>
        <p className="help-block">1GB - 1000GB</p>
      </div>
    );
  }
}

Slider.propTypes = {
  min: React.PropTypes.number,
  max: React.PropTypes.number,
  step: React.PropTypes.number,
  value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
  onChange: React.PropTypes.func,
};

export default Slider;
