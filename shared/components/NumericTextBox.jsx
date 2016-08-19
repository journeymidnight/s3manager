import React from 'react';


class NumericTextBox extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.state = {
      data: { min: this.props.min, max: this.props.max, step: this.props.step, value: this.props.value },
    };
  }

  numChanged() {
    this.props.onChange(this.state.data.value);
  }

  handleBlur() {
    let myInput = this.refs.myInput.value.trim();
    if (myInput < this.state.data.min || myInput === '') {
      myInput = this.state.data.min;
    }
    if (myInput > this.state.data.max) {
      myInput = this.state.data.max;
    }
    this.refs.myInput.value = myInput;
    this.setState({ data: { value: myInput, init: false, min: this.state.data.min, max: this.state.data.max, step: this.state.data.step } });
    if (myInput !== 1) {
      this.numChanged();
    }
  }

  handleChange() {
    const myInput = this.refs.myInput.value.trim();
    this.refs.myInput.value = myInput;
    this.setState({ data: { value: myInput, init: false, min: this.state.data.min, max: this.state.data.max, step: this.state.data.step } });
    setTimeout(this.numChanged, 1000);
  }

  handleClick(event) {
    let myInput = this.refs.myInput.value.trim();
    const target = event.target;
    if (parseInt(myInput, 10)) {
      if (target.className === 'upTriangle') {
        myInput = Math.round(myInput) + Math.round(this.state.data.step);
        if (myInput > this.state.data.max) {
          myInput = this.state.data.max;
        }
        this.refs.myInput.value = myInput;
      } else if (target.className === 'downTriangle') {
        myInput = Math.round(myInput) - Math.round(this.state.data.step);
        if (myInput < this.state.data.min) {
          myInput = this.state.data.min;
        }
        this.refs.myInput.value = myInput;
      }
      this.setState({ data: { value: myInput, init: false, min: this.state.data.min, max: this.state.data.max, step: this.state.data.step } });
      this.numChanged();
    }
  }

  render() {
    const value = this.state.data.value;
    return (
      <div className="numericTextBox">
        <input className="form-control" ref="myInput" onBlur={this.handleBlur} onChange={this.handleChange} value={value} />
        <div className="clickDiv" onClick={this.handleClick}>
          <div className="upTriangle" />
          <div className="downTriangle" />
        </div>
      </div>
    );
  }
}

NumericTextBox.propTypes = {
  data: React.PropTypes.object,
  min: React.PropTypes.number,
  max: React.PropTypes.number,
  step: React.PropTypes.number,
  value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
  onChange: React.PropTypes.func,
};

export default NumericTextBox;
