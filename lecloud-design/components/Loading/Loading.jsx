import React, { PropTypes } from 'react';
import './Loading.scss';

class Loading extends React.Component {

  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { loading, type } = this.props;
    return (
      <div>
        {type === 'large' && <div className="loader-large">
          <div className="loader-inner ball-spin-fade-loader">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>}

        {type === 'normal' && loading && (
          <div className="loader">
            <div className="loader-inner ball-spin-fade-loader">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )}

        {type === 'normal' && !loading && (
          <i className="iconfont icon-refresh" />
        )}

      </div>
    );
  }
}

Loading.defaultProps = {
  loading: false,
  type: 'normal',
};

Loading.propTypes = {
  loading: PropTypes.bool,
  type: PropTypes.oneOf('normal', 'large'),
};

export default Loading;
