import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import i18n from '../i18n';

class Modal extends React.Component {

  constructor(props) {
    super(props);

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.state = {
      hidden: !props.pop,
    };
  }

  componentDidMount() {
    $(this.refs.modal).on('hidden.bs.modal', () => {
      this.setState({ hidden: true });
    });

    if (this.props.pop) {
      this.show();
    }
  }

  show() {
    $(this.refs.modal).modal('show');
    this.setState({ hidden: false });
  }

  hide() {
    $(this.refs.modal).modal('hide');
    this.setState({ hidden: true });
  }

  render() {
    const props = this.props;

    return (
      <div className="modal fade" tabIndex="-1" role="dialog" id={props.id} ref="modal">
        <div className="modal-dialog">
          <div className="modal-content">
            {props.title && <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal"><span>&times;</span></button>
              <h4 className="modal-title">{props.title}</h4>
            </div>}
            {!this.state.hidden && props.children}
          </div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  id: React.PropTypes.string,
  title: React.PropTypes.string,
  pop: React.PropTypes.any,
  children: React.PropTypes.element.isRequired,
};

function injectModal(modal) {
  const dest = document.createElement('div');
  document.body.appendChild(dest);
  render(modal, dest);
}

export function popModal(title, children) {
  const id = Math.random().toString(36).slice(2);
  const modal = <Modal id={id} title={title} pop >{children}</Modal>;

  injectModal(modal);
}

export function confirmModal(text, done, cancel) {
  popModal('', (
    <div>
      <div className="modal-body">
        {text}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-default" data-dismiss="modal" onClick={cancel}>{i18n.t('closeModal')}</button>
        <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={done}>{i18n.t('confirmModal')}</button>
      </div>
    </div>
  ));
}

export function alertModal(text) {
  popModal('', (
    <div>
      <div className="modal-body">
        {text}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-primary" data-dismiss="modal">{i18n.t('confirmModal')}</button>
      </div>
    </div>
  ));
}

export default Modal;
