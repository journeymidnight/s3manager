import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';

const C = (props) => {
  let notify = <div />;
  if (props.notify && props.notify.type === 'notice') {
    notify = <div className="flash-notice">{props.notify.message}</div>;
    $(window).scrollTop(0);
  } else if (props.notify && props.notify.type === 'alert') {
    notify = <div className="flash-alert">{props.notify.message}</div>;
    $(window).scrollTop(0);
  }
  return (
    <div className="flash-container">
      {notify}
    </div>
  );
};

C.propTypes = {
  notify: React.PropTypes.object,
};

function mapStateToProps(state) {
  return {
    notify: state.context && state.context.notify,
  };
}

export default connect(mapStateToProps)(C);
