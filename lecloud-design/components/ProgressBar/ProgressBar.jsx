import React, { PropTypes } from 'react';
import './ProgressBar.scss';

class ProgressBar extends React.Component {

  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { title, progress, total } = this.props;
    return (
      <div className="progressbar">
        {title && <div className="progressbar-title">
          <h2>{title}</h2>
        </div>}
        <div className="progressbar-bar">
          <div
            className="progressbar-progress"
            style={{ width: `${progress * 100}%` }}
          >
            <span
              className="progressbar-percent"
            >
              {`${+(progress * 100).toFixed(0)}%`}
              <i className="iconfont progressbar-icon icon-arrow_down" />
            </span>
          </div>
        </div>
        <span className="progressbar-number">
          <span className="progressbar-number-current">{Math.round(progress * total)}</span>
          {` / ${Math.round(total)}`}
        </span>
      </div>
    );
  }
}

ProgressBar.defaultProps = {};

ProgressBar.propTypes = {
  title: PropTypes.string,
  progress: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default ProgressBar;
