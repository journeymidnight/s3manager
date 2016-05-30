import React from 'react';
import RegionPage, { attach } from '../../shared/pages/RegionPage';

class C extends RegionPage {
  render() {
    const { t } = this.props;

    return (
      <div className="panel panel-default">
        <div className="panel-heading">{t('settings')}</div>
        <div className="errors-holder"></div>
        <div className="panel-body">
        </div>
      </div>
    );
  }
}

export default attach(C);
