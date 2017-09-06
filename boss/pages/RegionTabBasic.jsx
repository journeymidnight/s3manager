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

      dispatch(RegionActions.requestModifyRegion({
        regionId: this.props.region2.regionId,
        name,
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
    let myregion = {}
    myregion.regionId = this.props.context.region.regionId;
    myregion.name = this.props.context.region.regionName;
    return (
      <div className="panel panel-default prepend-top-20">
        <div className="panel-heading">{t('settings')}</div>
        <div className="panel-body">
          <RegionForm initialValues={myregion} onSubmit={this.onSave} isUpdate />
        </div>
      </div>
    );
  }
}

export default attach(C);
