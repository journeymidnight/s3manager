import React, { PropTypes } from 'react';
import './Bar.scss';

class Bar extends React.Component {

  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { children, ...rest } = this.props;
    return (
      <div className={`bar ${this.props.type}`} {...rest}>
        {children}
      </div>
    );
  }
}

Bar.defaultProps = {
  type: 'primary',
};

Bar.propTypes = {
  children: PropTypes.node,
  type: PropTypes.oneOf(['primary', 'secondary']),
};

export default Bar;
