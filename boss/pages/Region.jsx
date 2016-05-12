import React from 'react';
import Page, { attach } from '../../shared/pages/Page';
import * as RegionActions from '../redux/actions';
import RegionForm from '../forms/RegionForm';

class C extends Page {

  componentDidMount() {
    const { params, dispatch } = this.props;

    this.regionId = params.regionId;
    dispatch(RegionActions.requestDescribeRegion(this.regionId));

    this.onSave = this.onSave.bind(this);
  }

  onSave(values, dispatch) {
    return new Promise((resolve, reject) => {
      const name = values.name;
      const description = values.description;

      dispatch(RegionActions.requestModifyRegion({
        regionId: this.regionId,
        name,
        description,
      }))
      .then(() => {
        resolve();
      }).catch(() => {
        reject();
      });
    });
  }

  render() {
    const { t } = this.props;

    const region = this.props.context.region;
    if (region === undefined) {
      return <div />;
    }

    return (
      <div className="container-fluid container-limited">
        <div className="content">
          <div className="clearfix">
            <h3 className="page-title">
              {t('region')} {region.name}
            </h3>
            <hr />
            <div className="panel panel-default">
              <div className="panel-heading">{t('settings')}</div>
              <div className="errors-holder"></div>
              <div className="panel-body">
                <RegionForm initialValues={region} onSubmit={this.onSave} isUpdate />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default attach(C);
