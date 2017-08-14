import React from 'react';
import './Slider.scss';

class Slider extends React.Component {

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
    this.handleDotMouseDown = this.handleDotMouseDown.bind(this);
    this.handleBarMouseDown = this.handleBarMouseDown.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.min = this.props.min;
    this.max = this.props.max;
    this.step = this.props.step;
    this.unit = this.props.unit;
    this.state = {
      value: this.props.value,
    };
  }

  componentDidMount() {
    this.atomicWidth = this.sliderBox.getBoundingClientRect().width / this.max;
    this.atomicValue = 1 / this.atomicWidth;
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

  handleMouseDown(event) {
    const sliderBar = this.sliderBar;
    const that = this;
    const originalValue = (event.pageX - sliderBar.getBoundingClientRect().left) * that.atomicValue;
    const value = this.checkAndAdjustValue(originalValue);
    this.setState({ value });
    this.props.onChange(value);
  }

  handleDotMouseDown() {
    const mousemoveListener = (event) => {
      this.handleMouseDown(event);
    };
    const onmouseupListener = () => {
      document.removeEventListener('mousemove', mousemoveListener, false);
      document.removeEventListener('mouseup', onmouseupListener, false);
    };
    document.addEventListener('mousemove', mousemoveListener, false);
    document.addEventListener('mouseup', onmouseupListener, false);
  }

  handleBarMouseDown(event) {
    this.handleMouseDown(event);
  }

  handleChange() {
    this.setState({ value: this.myInput.value });
    setTimeout(() => {
      const value = this.checkAndAdjustValue(Number(this.myInput.value.trim()));
      this.setState({ value });
      this.props.onChange(value);
    }, 1500);
  }

  handleBlur() {
    const value = this.checkAndAdjustValue(Number(this.myInput.value.trim()));
    this.setState({ value });
    this.props.onChange(value);
  }

  render() {
    const value = this.state.value;
    return (
      <div className="slider-container">
        <div className="slider slider-horizontal" ref={(sliderBox) => { this.sliderBox = sliderBox; }}>
          <div className="slider-track" onMouseDown={this.handleBarMouseDown}>
            <div
              className="slider-selection"
              ref={(sliderBar) => { this.sliderBar = sliderBar; }}
              style={{ width: this.calcSelectionWidth(value).toString().concat('px') }}
            />
            <div
              className="slider-handle"
              onMouseDown={this.handleDotMouseDown}
              style={{ left: (this.calcSelectionWidth(value) + 4).toString().concat('px') }}
            />
          </div>
        </div>
        <div className="slider-text">
          <input
            type="text"
            className="form-control preview mini"
            value={value}
            ref={(input) => { this.myInput = input; }}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            onKeyPress={this.handleEnterPress}
          />
          <span className="help inline">{this.unit}</span>
        </div>
      </div>
    );
  }
}

Slider.propTypes = {
  min: React.PropTypes.number,
  max: React.PropTypes.number,
  step: React.PropTypes.number,
  unit: React.PropTypes.string,
  value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
  onChange: React.PropTypes.func,
};

export default Slider;
