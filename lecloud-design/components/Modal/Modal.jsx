import React, { PropTypes } from 'react';
import { render } from 'react-dom';
import Row from '../Row';
import Col from '../Col';
import cx from 'classnames';
import './Modal.scss';

class Modal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      key: Date.now(),
      isClosed: !props.willPop,
    };

    this.onClose = this.onClose.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  onClose() {
    const { onClose } = this.props;

    if (onClose) {
      onClose();
    } else {
      this.close();
    }
  }

  open() {
    this.setState({
      key: Date.now(),
      isClosed: false,
    });
  }

  close() {
    this.setState({
      isClosed: true,
    });
  }

  render() {
    const { title, children, willPop, done, cancel, lng } = this.props;
    return (
      <div
        key={this.state.key}
        className={cx({
          modal: true,
          'modal-closed': this.state.isClosed,
          'pop-modal': willPop,
        })}
      >
        <div
          className="modal-body"
        >
          <div className="modal-header">
            <h2>{title}</h2>
            <a
              href
              onClick={(e) => {
                e.preventDefault();
                this.onClose();
              }}
            >
              &times;
            </a>
          </div>

          <div className="modal-content">
            {children}
          </div>

          {willPop && <div className="modal-footer">
            <Row style={{ height: '100%' }}>
              {done && <Col span={6} style={{ borderRight: 'solid 1px #ededf1', height: '100%' }}>
                <button type="button" className="button button-white button-transparent" onClick={() => { this.onClose(); cancel(); }}>{lng === 'zh' ? '取消' : 'Cancel'}</button>
              </Col>}

              {done ? (<Col span={6} style={{ height: '100%' }}>
                <button
                  type="button"
                  style={{ color: '#208ac3' }}
                  className="button button-transparent"
                  onClick={() => { this.onClose(); done(); }}
                >{lng === 'zh' ? '确认' : 'Confirm'}</button>
              </Col>) : (<Col span={6} offset={6}>
                <button type="button" style={{ color: '#208ac3' }} className="button button-transparent" onClick={this.close}>{lng === 'zh' ? '确认' : 'Confirm'}</button>
              </Col>)}
            </Row>
          </div>}
        </div>
      </div>
    );
  }
}

Modal.defaultProps = {
  lng: 'zh',
};

Modal.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func,
  children: PropTypes.node,
  willPop: PropTypes.bool,
  done: PropTypes.func,
  cancel: PropTypes.func,
  lng: PropTypes.string,
};


function injectModal(modal) {
  const dest = document.createElement('div');
  document.body.appendChild(dest);
  render(modal, dest);
}

export function popModal(title, children, done, cancel, lng) {
  const id = Math.random().toString(36).slice(2);
  const modal = <Modal id={id} title={title} willPop done={done} cancel={cancel} lng={lng}>{children}</Modal>;

  injectModal(modal);
}

export function confirmModal(text, done, cancel, lng) {
  popModal('', (<div style={{ textAlign: 'center', paddingTop: 40 }}><span>{text}</span></div>), done, cancel, lng);
}

export function alertModal(text, lng) {
  popModal('', <div style={{ textAlign: 'center', paddingTop: 40 }}><span>{text}</span></div>, lng);
}

export default Modal;
