import React from 'react';
import Time from 'react-time';
import { Link } from 'react-router';
import { attach } from '../../shared/pages/Page';
import TablePage from '../../shared/pages/TablePage';
import * as Actions from '../redux/actions';
import * as ActivityActions from '../redux/actions.activity';

class C extends TablePage {

  initialize(routerKey) {
    const { t, dispatch, servicePath } = this.props;
    dispatch(Actions.setHeader(t('activityManage'), `${servicePath}/activities`));

    this.initTable(routerKey, { searchWord: undefined, status: undefined });
  }

  refreshAction(routerKey, filters) {
    const { region } = this.props;
    return ActivityActions.requestDescribeOperations(routerKey, region.regionId, filters);
  }

  buildResourceLinks(operation) {
    const { servicePath } = this.props;
    const map = {
      instance: 'instances',
      network: 'networks',
      subnet: 'subnets',
      portForwarding: 'portForwardings',
      volume: 'volumes',
      image: 'images',
      snapshot: 'snapshots',
      eip: 'eips',
      keyPair: 'key_pairs',
    };
    return operation.resourceIds.map((item, index) => {
      return (<span key={index}>
        {(operation.resourceType === 'subnet' || operation.resourceType === 'portForwarding') ?
          <span>{item}</span> : <Link to={`${servicePath}/${map[operation.resourceType]}/${item}`}>{item}</Link>}
        {operation.resourceIds.length - 1 !== index && <span>, </span>}
      </span>);
    });
  }

  renderTable() {
    const { t } = this.props;
    return this.props.context.total > 0 && this.props.context.operationSet.length > 0 && (
      <table className="table">
        <thead>
          <tr>
            <th>{t('action')}</th>
            <th>{t('resource')}</th>
            <th>{t('status')}</th>
            <th width="200">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
          {this.props.context.operationSet.map((operation) => {
            const result = operation.retCode ? 'error' : 'finished';
            return (
              <tr key={operation.operationId}>
                <td>
                  {t(`actionTranslation.${operation.action}`)}
                </td>
                <td>
                  {this.buildResourceLinks(operation)}
                </td>
                <td className={`i-status i-status-${result}`}>
                  <i className="icon"></i>
                  {t(`operationStatus.${result}`)}
                </td>
                <td className="light"><Time value={operation.created} format="YYYY-MM-DD HH:mm:ss" /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  renderHeader() {
    const { t } = this.props;
    return (
      <div className="top-area">
        <div className="nav-text">
          <span className="light">
            {t('activityManageDescription')}
          </span>
        </div>
      </div>
    );
  }
}

export default attach(C);
