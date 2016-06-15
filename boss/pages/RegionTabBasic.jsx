import React from 'react';
import Page, { attach } from '../../shared/pages/RegionPage';
import * as Actions from '../redux/actions';
import RegionForm from '../forms/RegionForm';
import * as RegionActions from '../redux/actions.region';

class C extends Page {

  constructor(props) {
    super(props);

    this.onSave = this.onSave.bind(this);
  }

  componentDidMount() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('regionManage'), '/regions'));
  }

  onSave(values, dispatch) {
    return new Promise((resolve, reject) => {
      const name = values.name;
      const publicEndpoint = values.publicEndpoint;
      const manageEndpoint = values.manageEndpoint;
      const manageKey = values.manageKey;
      const manageSecret = values.manageSecret;

      dispatch(RegionActions.requestModifyRegion({
        regionId: this.props.region2.regionId,
        name,
        publicEndpoint,
        manageEndpoint,
        manageKey,
        manageSecret,
      }))
      .then(() => {
        resolve();
      }).catch(() => {
        reject();
      });
    });
  }

  render() {
    const { t, region2 } = this.props;
    return (
      <div className="panel panel-default prepend-top-20">
        <div className="panel-heading">{t('settings')}</div>
        <div className="panel-body">
          <RegionForm initialValues={region2} onSubmit={this.onSave} isUpdate />
        </div>
      </div>
    );
  }
}

export default attach(C);
