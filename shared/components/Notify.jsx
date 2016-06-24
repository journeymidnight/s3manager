import $ from 'jquery';
import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions';

class C extends React.Component {

  constructor(props) {
    super(props);

    this.hide = this.hide.bind(this);
  }

  hide() {
    const { dispatch } = this.props;
    dispatch(Actions.cleanNotify());
  }

  render() {
    let notify = <div />;
    if (this.props.notify) {
      notify = (
        <div className={`flash-${this.props.notify.type}`}>
          <button type="button" className="close" onClick={this.hide}><span>&times;</span></button>
          {this.props.notify.message}
        </div>);
      $(window).scrollTop(0);
    }
    return (
      <div className="flash-container">
        {notify}
      </div>
    );
  }
}

C.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  notify: React.PropTypes.object,
};

function mapStateToProps(state) {
  return {
    notify: state.context && state.context.notify,
  };
}

export default connect(mapStateToProps)(C);
