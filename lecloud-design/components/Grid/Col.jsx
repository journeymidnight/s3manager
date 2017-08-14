import React, { PropTypes } from 'react';
import cx from 'classnames';
import './Grid.scss';

class Col extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { className, span, offset, align, children, ...rest } = this.props;

    return (
      <div
        {...rest}
        className={cx({
          [className]: className,
          col: true,
          [`col-${span}`]: span !== undefined,
          [`col-offset-${offset}`]: offset,
          [`col-${align}`]: align,
        })}
      >
        {children}
      </div>
    );
  }
}

Col.defaultProps = {
  align: 'top',
};

Col.propTypes = {
  className: PropTypes.string,
  span: PropTypes.number,
  offset: PropTypes.number,
  align: PropTypes.oneOf(['top', 'middle', 'bottom']),
  children: PropTypes.node,
};

export default Col;
