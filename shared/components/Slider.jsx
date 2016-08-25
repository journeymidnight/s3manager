import React from 'react';
import ReactDOM from 'react-dom';


class Slider extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.state = {
      min: this.props.min, max: this.props.max, step: this.props.step, value: this.props.value,
    };
  }

  componentDidMount() {
    const myInput = parseInt(this.refs.myInput.value.trim(), 10);
    const sliderBar = ReactDOM.findDOMNode(this.refs.sliderBar);
    const sliderDot = ReactDOM.findDOMNode(this.refs.sliderDot);
    const widthStep = 600 / this.state.max;
    sliderBar.style.width = (myInput * widthStep).toString().concat('px');
    sliderDot.style.left = (myInput * widthStep - 4).toString().concat('px');
  }

  handleMouseDown(e) {
    const sliderBar = ReactDOM.findDOMNode(this.refs.sliderBar);
    const sliderDot = ReactDOM.findDOMNode(this.refs.sliderDot);
    const that = this;
    const wholeLeft = e.clientX - sliderDot.offsetLeft;
    const widthStep = 600 / this.state.max;

    document.onmousemove = function (event) {
      let barLeft = parseInt(event.clientX - wholeLeft, 10);
      barLeft = Math.round(barLeft / that.state.step / widthStep) * that.state.step * widthStep;
      let myValue = Math.round(barLeft / widthStep);
      let dotLeft = barLeft - 4;
      if (barLeft <= 0) {
        barLeft = that.state.min * widthStep;
        dotLeft = (barLeft - 4 < 0) ? barLeft : (barLeft - 4);
        myValue = that.state.min;
      } else if (barLeft >= that.state.max * widthStep) {
        barLeft = that.state.max * widthStep;
        dotLeft = barLeft - 9;
        myValue = that.state.max;
      }
      sliderDot.style.left = dotLeft.toString().concat('px');
      sliderBar.style.width = barLeft.toString().concat('px');
      that.refs.myInput.value = myValue;
      that.setState({
        min: that.state.min,
        max: that.state.max,
        step: that.state.step,
        value: myValue,
      });
    };
    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  }

  handleChange(e) {
    if (e.keyCode === 13) {
      const sliderBar = ReactDOM.findDOMNode(this.refs.sliderBar);
      const sliderDot = ReactDOM.findDOMNode(this.refs.sliderDot);
      const widthStep = 600 / this.state.max;
      let myInput = Math.round(parseInt(this.refs.myInput.value.trim(), 10) / this.state.step) * this.state.step;
      if (myInput === 0) {
        myInput = this.state.min;
      }

      let barLeft = myInput * widthStep;
      let dotLeft = barLeft - 4;

      let myValue = myInput;
      if (myInput < 0) {
        barLeft = this.state.min * widthStep;
        dotLeft = (barLeft - 4 < 0) ? barLeft : (barLeft - 4);
        myValue = this.state.min;
      } else if (myInput >= this.state.max) {
        barLeft = this.state.max * widthStep;
        dotLeft = barLeft - 9;
        myValue = this.state.max;
      }
      sliderDot.style.left = dotLeft.toString().concat('px');
      sliderBar.style.width = barLeft.toString().concat('px');
      this.setState({
        min: this.state.min,
        max: this.state.max,
        step: this.state.step,
        value: myValue,
      });
      this.props.onChange(myInput);
      this.refs.myInput.value = myValue;
    }
  }

  handleBlur() {
    const sliderBar = ReactDOM.findDOMNode(this.refs.sliderBar);
    const sliderDot = ReactDOM.findDOMNode(this.refs.sliderDot);

    const widthStep = 600 / this.state.max;
    let myInput = Math.round(parseInt(this.refs.myInput.value.trim(), 10) / this.state.step) * this.state.step;
    if (myInput === 0) {
      myInput = this.state.min;
    }

    let barLeft = myInput * widthStep;
    let dotLeft = barLeft - 4;
    let myValue = myInput;
    if (myInput < 0) {
      barLeft = this.state.min * widthStep;
      dotLeft = (barLeft - 4 < 0) ? barLeft : (barLeft - 4);
      myValue = this.state.min;
    } else if (myInput >= this.state.max) {
      barLeft = this.state.max * widthStep;
      dotLeft = barLeft - 9;
      myValue = this.state.max;
    }
    sliderDot.style.left = dotLeft.toString().concat('px');
    sliderBar.style.width = barLeft.toString().concat('px');
    this.setState({
      min: this.state.min,
      max: this.state.max,
      step: this.state.step,
      value: myValue,
    });
    this.props.onChange(myInput);
    this.refs.myInput.value = myValue;
  }

  render() {
    return (
      <div className="slider form-control col-sm-10" ref="slider">
        <div className="bar col-sm-5" ref="bar">
          <div className="sliderBar" ref="sliderBar" />
          <div className="sliderDot" ref="sliderDot" onMouseDown={this.handleMouseDown} />
        </div>
        <input type="text" className="sliderInput" defaultValue={this.state.value} ref="myInput" onKeyDown={this.handleChange} onBlur={this.handleBlur} />
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
