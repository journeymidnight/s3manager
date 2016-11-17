import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import TextInput from '../../shared/components/FormInputs/TextInput';
import Slider from '../../shared/components/Slider';
import * as Validations from '../../shared/utils/validations';

class F extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      subnetSet: props.availableNetworks[0].subnets,
    };
  }

  componentDidMount() {
    const initialValues = {
      networkId: this.props.availableNetworks[0].networkId,
      subnetId: this.props.availableNetworks[0].subnets[0].subnetId,
      bandwidth: 10,
    };
    this.props.initializeForm(initialValues);
  }

  onNetworkChange(param) {
    const { fields: { subnetId, networkId } } = this.props;
    const subnets = this.props.availableNetworks.filter(
      (network) => {
        return network.networkId === param.target.value;
      })[0].subnets;
    this.setState({ subnetSet: subnets });
    networkId.onChange(param);
    subnetId.onChange(subnets[0].subnetId);
  }

  render() {
    const { fields:
      { name, description, networkId, subnetId, bandwidth },
      handleSubmit,
      submitting,
      submitFailed,
      resetForm,
      t,
    } = this.props;
    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>

        <TextInput item={name} itemName="name" submitFailed={submitFailed} inputParams={{ maxLength: '50' }} t={t} />

        <div className={(submitFailed || description.touched) && description.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('description')}</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" {...description} maxLength="250" />
            {(submitFailed || description.touched) && description.error && <div className="text-danger"><small>{description.error}</small></div>}
          </div>
        </div>

        <div className={(submitFailed || subnetId.touched) && subnetId.error ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" >{t('subnet')}</label>
          <div className="col-sm-10">
            <select className="form-control form-control-md" {...networkId} onChange={(param) => { this.onNetworkChange(param); }}>
                {this.props.availableNetworks.map((network) => {
                  return (
                    <option key={network.networkId} value={network.networkId}>
                      {network.name} ({network.networkId})
                    </option>
                  );
                })}
            </select>
            {this.state.subnetSet && <select className="form-control form-control-md select-subnet" {...subnetId}>
                {this.state.subnetSet.map((subnet) => {
                  return (
                    <option key={subnet.subnetId} value={subnet.subnetId}>
                      {subnet.subnetId}
                    </option>
                  );
                })}
            </select>}
            {(submitFailed || subnetId.touched) && subnetId.error && <div className="text-danger"><small>{subnetId.error}</small></div>}
          </div>
        </div>

        <div className="form-group">
          <label className="control-label" >{t('bandwidth')}</label>
          <div className="col-sm-10">
            <input type="hidden" className="form-control" value={bandwidth.value} disabled="disabled" />
            <Slider min={1} max={300} step={1} value={bandwidth.value} unit={'Mbps'} onChange={param => bandwidth.onChange(param)} />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-save" disabled={submitting}>
            {submitting ? <i className="fa fa-spin fa-spinner" /> : <i />} {t('update')}
          </button>
          &nbsp;
          <button type="button" className="btn btn-cancel" disabled={submitting} onClick={resetForm}>
            {t('reset')}
          </button>
        </div>
      </form>
    );
  }
}

F.propTypes = {
  fields: React.PropTypes.object.isRequired,
  error: React.PropTypes.string,
  initializeForm: React.PropTypes.func.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitFailed: React.PropTypes.bool.isRequired,
  resetForm: React.PropTypes.func.isRequired,
  t: React.PropTypes.any,
  availableNetworks: React.PropTypes.array,
};

F.validate = values => {
  const errors = {};
  errors.bandwidth = Validations.integer(values.bandwidth);
  return errors;
};

export default reduxForm({
  form: 'LoadBalancerCreateForm',
  fields: ['name', 'description', 'subnetId', 'bandwidth', 'networkId'],
  validate: F.validate,
})(translate()(F));
