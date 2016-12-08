import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import * as Actions from '../redux/actions';
import RegionForm from '../forms/RegionForm';
import * as RegionActions from '../redux/actions.region';

class C extends Page {

  constructor(props) {
    super(props);

    this.onSave = this.onSave.bind(this);
  }

  initialize() {
    const { t, dispatch } = this.props;
    dispatch(Actions.setHeader(t('regionManage'), '/regions'));
  }

  onSave(values, dispatch) {
    return new Promise((resolve, reject) => {
      const name = values.name;
      const devopsEndpoint = values.devopsEndpoint;
      const consoleEndpoint = values.consoleEndpoint;

      dispatch(RegionActions.requestModifyRegion({
        regionId: this.props.region2.regionId,
        name,
        devopsEndpoint,
        consoleEndpoint,
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
