import React from 'react';
import { translate } from 'react-i18next';

const C = (props) => {
  const { t } = props;
  return (
    <div className="gl-pagination">
      <ul className="pagination clearfix">
        {props.currentPage > 1 && <li>
          <a href onClick={props.onRefresh({ currentPage: 1 })}>
            {t('paging.first')}
          </a>
        </li>}
        {props.currentPage > 1 && <li>
          <a href onClick={props.onRefresh({ currentPage: props.currentPage - 1 }, false)}>
            {props.currentPage - 1}
          </a>
        </li>}
        <li className="active">
          <span>{props.currentPage}</span>
        </li>
        {props.currentPage < props.totalPage && <li>
          <a href onClick={props.onRefresh({ currentPage: props.currentPage + 1 }, false)}>
            {props.currentPage + 1}
          </a>
        </li>}
        {props.currentPage < props.totalPage && <li>
          <a href onClick={props.onRefresh({ currentPage: props.totalPage }, false)}>{t('paging.last')}</a>
        </li>}
      </ul>
    </div>
  );
};

C.propTypes = {
  currentPage: React.PropTypes.any,
  totalPage: React.PropTypes.any,
  onRefresh: React.PropTypes.func,
  t: React.PropTypes.any,
};

export default translate()(C);
