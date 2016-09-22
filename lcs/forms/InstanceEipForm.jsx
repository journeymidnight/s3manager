import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import IaaS, { ACTION_NAMES } from '../services/iaas';
import * as Validations from '../../shared/utils/validations';

class InstanceEipForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = { initialized: false };
  }

  componentDidMount() {
    const { region } = this.props;

    IaaS
      .doAction(region.regionId, ACTION_NAMES.describeEips, {
        status: ['active'],
        limit: 100,
      })
      .promise
      .then((payload) => {
        this.eipSet = payload.eipSet;
        if (this.eipSet.length) {
          this.props.initializeForm({ eipId: this.eipSet[0].eipId });
        }
        this.setState({ initialized: true });
      });
  }

  render() {
    if (!this.state.initialized) {
      return <div />;
    }

    const { fields:
      { eipId },
      handleSubmit,
      submitting,
      t,
    } = this.props;
    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className="modal-body">

          <div className="form-group">
            <label className="control-label" >{t('eip')}</label>
            <div className="col-sm-10">
              <select className="form-control" {...eipId}>
                {this.eipSet && this.eipSet.map((eip) => {
                  return (
                    <option key={eip.eipId} value={eip.eipId}>
                      {eip.name} ({eip.address})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" data-dismiss="modal">{t('closeModal')}</button>
          <button type="submit" className="btn btn-save" disabled={submitting}>
            {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('update')}
          </button>
        </div>
      </form>
    );
  }
}

InstanceEipForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  handleSubmit: React.PropTypes.func.isRequired,
  initializeForm: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  instance: React.PropTypes.object.isRequired,
  region: React.PropTypes.object.isRequired,
  t: React.PropTypes.any,
};

InstanceEipForm.validate = values => {
  const errors = {};
  errors.eipId = Validations.required(values.eipId);
  return errors;
};

InstanceEipForm = reduxForm({
  form: 'InstanceEipForm',
  fields: ['eipId'],
  validate: InstanceEipForm.validate,
})(translate()(InstanceEipForm));

export default InstanceEipForm;
