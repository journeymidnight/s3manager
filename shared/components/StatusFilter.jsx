import React from 'react';
import { translate } from 'react-i18next';

const C = (props) => {
  return (
    <div className="dropdown">
      <button className="dropdown-menu-toggle" data-toggle="dropdown" type="button">
        <span className="dropdown-toggle-text">{props.t('status')}</span>
        <i className="fa fa-chevron-down"></i>
      </button>
      <div className="dropdown-menu dropdown-select dropdown-menu-selectable">
        <div className="dropdown-content">
          <ul>
            {props.statusOption.map((filter) => {
              return (
                <li key={filter.name}>
                  <a
                    className={props.filterStatus.toString() === filter.status.toString() ? 'is-active' : ''}
                    href
                    onClick={props.onRefresh({ status: filter.status })}
                  >
                    {filter.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

C.propTypes = {
  statusOption: React.PropTypes.array,
  filterStatus: React.PropTypes.any,
  onRefresh: React.PropTypes.func,
  t: React.PropTypes.any,
};

export default translate()(C);
