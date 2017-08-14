import React, { Children, cloneElement, PropTypes } from 'react';
import cx from 'classnames';
import './Grid.scss';

class Row extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { className, gutter, style, children, ...rest } = this.props;
    const rowStyle = gutter > 0 ? Object.assign({}, {
      marginLeft: gutter / -2,
      marginRight: gutter / -2,
    }, style) : style;
    const cols = Children.map(children, (col) => {
      if (!col) {
        return null;
      }
      if (col.props) {
        return cloneElement(col, {
          style: gutter > 0 ? Object.assign({}, {
            paddingLeft: gutter / 2,
            paddingRight: gutter / 2,
          }, col.props.style) : col.props.style,
        });
      }
      return col;
    });

    return (
      <div
        {...rest}
        className={cx({
          [className]: className,
          row: true,
        })}
        style={rowStyle}
      >
        {cols}
      </div>
    );
  }
}

Row.defaultProps = {
  gutter: 0,
};

Row.propTypes = {
  className: PropTypes.string,
  gutter: PropTypes.number,
  style: PropTypes.object, // React.CSSProperties in ant design
  children: PropTypes.node,
};

export default Row;
