import React from 'react';
import { translate } from 'react-i18next';
import { reduxForm } from 'redux-form';
import TextInput from '../../shared/components/FormInputs/TextInput';
import SliderInput from '../../shared/components/FormInputs/SliderInput';
import FooterButtons from '../../shared/components/FormInputs/FooterButtons';
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

        <TextInput
          item={name}
          itemName="name"
          submitFailed={submitFailed}
          inputParams={{ maxLength: '50' }}
          t={t}
        />

        <TextInput
          item={description}
          itemName="description"
          submitFailed={submitFailed}
          inputParams={{ maxLength: '250' }}
          t={t}
        />

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

        <SliderInput
          item={bandwidth}
          itemName="bandwidth"
          max={300}
          min={1}
          step={1}
          unit="Mbps"
          t={t}
        />

        <div className="form-actions">
          <FooterButtons
            resetForm={resetForm}
            submitting={submitting}
            t={t}
          />
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
