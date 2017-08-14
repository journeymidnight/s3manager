import React from 'react';
import ReactDOM from 'react-dom';
import './Notification.scss';

const Notification = (props) => {
  const { type, text } = props;
  return (
    <div className="container-notification">
      <div className={`notification notification-${type}`}>
        <span>{text}</span>
      </div>
    </div>
  );
};

Notification.propTypes = {
  type: React.PropTypes.string,
  text: React.PropTypes.string,
};

function notify(type, text, timeout) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  ReactDOM.render(<Notification type={type} text={text} />, div);
  setTimeout(() => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  }, timeout);
}

export default {
  error: (text, timeout) => {
    notify('error', text, timeout);
  },
  success: (text, timeout) => {
    notify('success', text, timeout);
  },
  info: (text, timeout) => {
    notify('info', text, timeout);
  },
};
