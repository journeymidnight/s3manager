import React from 'react';
import { Link } from 'react-router';
import Time from 'react-time';
import { attach } from '../../shared/pages/Page';
import TablePage from '../../shared/pages/TablePage';
import * as Actions from '../redux/actions';
import * as SnapshotActions from '../redux/actions.snapshot';

class C extends TablePage {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.initTable({ isTabPage: true });
  }

  refreshAction(routerKey, filters) {
    const { region } = this.props;
    return SnapshotActions.requestDescribeSnapshots(routerKey, region.regionId, filters);
  }


  renderTable() {
    const { t } = this.props;
    return this.props.context.total > 0 && this.props.context.snapshotSet.length > 0 && (
      <table className="table">
        <thead>
          <tr>c
            <th width="40">
              <input type="checkbox" className="selected" onChange={this.onSelectAll(this.props.context.snapshotSet.map((u) => { return u.snapshotId; }))} />
            </th>
            <th width="150">{t('id')}</th>
            <th>{t('name')}</th>
            <th>{t('size')}</th>
            <th>{t('status')}</th>
            <th width="200">{t('created')}</th>
          </tr>
        </thead>
        <tbody>
          {this.props.context.snapshotSet.map((snapshot) => {
            return (
              <tr key={snapshot.snapshotId}>
                <td>
                  <input type="checkbox" className="selected" onChange={this.onSelect(snapshot.snapshotId)} checked={this.props.context.selected[snapshot.snapshotId] === true} />
                </td>
                <td>
                  <Link to={`/${this.props.region.regionId}/snapshots/${snapshot.snapshotId}`}>
                    {snapshot.snapshotId}
                  </Link>
                </td>
                <td>
                  {snapshot.name && <strong>{snapshot.name}</strong>}
                  {!snapshot.name && <i className="text-muted">{t('noName')}</i>}
                </td>
                <td>{snapshot.size}G</td>
                <td className={`i-status i-status-${snapshot.status}`}>
                  <i className="icon"></i>
                  {t(`snapshotStatus.${snapshot.status}`)}
                </td>
                <td className="light"><Time value={snapshot.created} format="YYYY-MM-DD HH:mm:ss" /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

export default attach(C);
