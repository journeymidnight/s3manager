import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import * as Validations from '../../shared/utils/validations';

const F = (props) => {
  const { fields:
    { content },
    handleSubmit,
    submitting,
    submitFailed,
    t,
  } = props;
  return (
    <form onSubmit={handleSubmit}>

      <div className={(submitFailed || content.touched) && content.error ? 'form-group has-error' : 'form-group'}>
        <textarea rows="3" className="form-control" {...content} />
        {(submitFailed || content.touched) && content.error && <div className="text-danger"><small>{content.error}</small></div>}
      </div>

      <div>
        <button type="submit" className="pull-right btn btn-save" disabled={submitting}>
          {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('pageTicket.reply')}
        </button>
      </div>
    </form>
  );
};

F.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  t: React.PropTypes.any,
};

F.validate = (values) => {
  const errors = {};
  errors.content = Validations.required(values.content);
  return errors;
};

export default reduxForm({
  form: 'TicketReplyForm',
  fields: ['content'],
  validate: F.validate,
})(translate()(F));
