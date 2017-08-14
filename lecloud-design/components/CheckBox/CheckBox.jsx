import React, { PropTypes } from 'react';
import cx from 'classnames';
import './CheckBox.scss';

class CheckBox extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isChecked: this.props.isChecked,
    };

    this.onClick = this.onClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isChecked: nextProps.isChecked,
    });
  }

  onClick() {
    const { onClick } = this.props;

    if (onClick) {
      this.setState({
        isChecked: !this.state.isChecked,
      }, () => onClick(this.state.isChecked));
    } else {
      this.setState({
        isChecked: !this.state.isChecked,
      });
    }
  }

  render() {
    return (
      <button
        className="checkbox"
        onClick={this.onClick}
      >
        <i
          className={cx({
            iconfont: true,
            'icon-checkbox_selected': this.state.isChecked,
            'icon-checkbox': !this.state.isChecked,
          })}
        />
      </button>
    );
  }
}

CheckBox.defaultProps = {
  defaultIsChecked: false,
};

CheckBox.propTypes = {
  isChecked: PropTypes.bool,
  onClick: PropTypes.func,
};

export default CheckBox;
