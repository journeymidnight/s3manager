import React from 'react';


class Selector extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.state = { data: this.props.data, defaultValue: this.props.defaultValue, selectedSnapshot: this.props.selectedSnapshot, };
  }

  componentDidMount() {
    const oUl = this.refs.ul;
    const data = this.props.data;
    for (let i = 0; i < data.length; i++) {
      const oLi = document.createElement('li');
      oLi.innerText = data[i].name;
      oUl.appendChild(oLi);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.data, defaultValue: nextProps.defaultValue, selectedSnapshot: nextProps.selectedSnapshot, });
  }

  shouldComponentUpdate(nextProps) {
    if (this.state.selectedSnapshot) {
      return nextProps.snapshotId !== this.state.selectedSnapshot.snapshotId;
    }
    return false;
  }

  componentWillUpdate(nextProps) {
    this.refs.showRegion.innerText = nextProps.defaultValue;
    this.state.selectedSnapshot = nextProps.selectedSnapshot;
  }

  handleClick(e) {
    const target = e.target;
    const oUl = this.refs.ul;
    const oTriangle = this.refs.triangle;
    const regExp1 = /p/i;
    const regExp2 = /li/i;
    if (regExp1.test(target.tagName)) {
      if (/hidden/.test(oUl.className)) {
        oUl.className = oUl.className.replace('hidden', 'show');
      }
      if (/down/.test(oTriangle.className)) {
        oTriangle.className = oTriangle.className.replace('down', 'up');
      }
    } else if (regExp2.test(target.tagName)) {
      this.refs.showRegion.innerText = target.innerText;
      oUl.className = oUl.className.replace('show', 'hidden');
      if (/up/.test(oTriangle.className)) {
        oTriangle.className = oTriangle.className.replace('up', 'down');
      }
      const data = this.props.data;
      for (let i = 0; i < data.length; i++) {
        if (data[i].name === target.innerText) {
          this.props.onChange(data[i].snapshotId);
          this.setState({
            data: this.state.data, defaultValue: this.state.defaultValue, selectedSnapshot: data[i],
          });
        }
      }
    } else {
      if (/show/.test(oUl.className)) {
        oUl.className = oUl.className.replace('show', 'hidden');
      }
      if (/up/.test(oTriangle.className)) {
        oTriangle.className = oTriangle.className.replace('up', 'down');
      }
    }
  }

  render() {
    return (
      <div className="select" ref="select" onClick={this.handleClick}>
        <p className="form-control" ref="showRegion">{this.props.defaultValue}</p>
        <div ref="triangle" className="down" />
        <ul ref="ul" className="hidden">
          <li>{this.props.defaultValue}</li>
        </ul>
      </div>
    );
  }
}

Selector.propTypes = {
  data: React.PropTypes.any,
  defaultValue: React.PropTypes.string,
  selectedSnapshot: React.PropTypes.any,
  onChange: React.PropTypes.func,
};

export default Selector;
