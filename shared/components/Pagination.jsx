import React from 'react';
import { translate } from 'react-i18next';

const C = (props) => {
  return (
    <div className="gl-pagination">
      <ul className="pagination clearfix">
        {props.currentPage > 3 && <li>
          <a href onClick={props.onRefresh({ currentPage: 1 })}>1</a>
        </li>}
        {props.currentPage > 4 && <li>
          <a>...</a>
        </li>}
        {props.currentPage > 2 && <li>
          <a href onClick={props.onRefresh({ currentPage: props.currentPage - 2 }, false)}>
            {props.currentPage - 2}
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
        {props.currentPage < props.totalPage - 1 && <li>
          <a href onClick={props.onRefresh({ currentPage: props.currentPage + 2 }, false)}>
            {props.currentPage + 2}
          </a>
        </li>}
        {props.currentPage < props.totalPage - 3 && <li>
          <a>...</a>
        </li>}
        {props.currentPage < props.totalPage - 2 && <li>
          <a href onClick={props.onRefresh({ currentPage: props.totalPage }, false)}>
            {props.totalPage}
          </a>
        </li>}
        <li>
          <span>
            {props.t('totalItems')}{props.total}
          </span>
        </li>
      </ul>
    </div>
  );
};

C.propTypes = {
  currentPage: React.PropTypes.any,
  totalPage: React.PropTypes.any,
  onRefresh: React.PropTypes.func,
  t: React.PropTypes.any,
  total: React.PropTypes.number,
};

export default translate()(C);
