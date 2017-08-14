import React, { PropTypes } from 'react';
import './Panel.scss';

class Panel extends React.Component {

  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { title, action, children } = this.props;
    return (
      <div className="panel">
        <div className="panel-header">
          {title && <h2>{title}</h2>}
          {action && <div className="panel-right">
            {action}
          </div>}
        </div>

        <div className="panel-content">
          {children}
        </div>
      </div>
    );
  }
}

Panel.defaultProps = {};

Panel.propTypes = {
  title: PropTypes.node,
  action: PropTypes.node,
  children: PropTypes.node,
};

export default Panel;
