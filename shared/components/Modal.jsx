import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import i18n from '../i18n';

const Modal = (props) => {
  return (
    <div className="modal fade" tabIndex="-1" role="dialog" id={props.id}>
      <div className="modal-dialog">
        <div className="modal-content">
          {props.title && <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal"><span>&times;</span></button>
            <h4 className="modal-title">{props.title}</h4>
          </div>}
          {props.children}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  id: React.PropTypes.string,
  title: React.PropTypes.string,
  children: React.PropTypes.element.isRequired,
};

export function confirmModal(text, done, cancel) {
  const id = Math.random().toString(36).slice(2);
  const modal = (
    <Modal id={id}>
      <div>
        <div className="modal-body">
          {text}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" data-dismiss="modal" onClick={cancel}>{i18n.t('closeModal')}</button>
          <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={done}>{i18n.t('confirmModal')}</button>
        </div>
      </div>
    </Modal>
  );

  const dest = document.createElement('div');
  document.body.appendChild(dest);
  render(modal, dest);

  $(`#${id}`)
  .modal('show')
  .on('hidden.bs.modal', (e) => {
    e.preventDefault();
    // if (cancel) {
    //   cancel();
    // }
  });
}

export function alertModal(text) {
  const id = Math.random().toString(36).slice(2);
  const modal = (
    <Modal id={id}>
      <div>
        <div className="modal-body">
          {text}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" data-dismiss="modal">{i18n.t('confirmModal')}</button>
        </div>
      </div>
    </Modal>
  );

  const dest = document.createElement('div');
  document.body.appendChild(dest);
  render(modal, dest);
  $(`#${id}`).modal('show');
}

export default Modal;
