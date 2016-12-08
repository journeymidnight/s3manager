import React from 'react';
import { translate } from 'react-i18next';

const C = (props) => {
  const pageArray = [];
  const { currentPage, totalPage } = props;
  for (let i = 1; i < totalPage + 1; i++) {
    pageArray.push(i);
  }

  return (
    <div className="gl-pagination">
      <ul className="pagination clearfix">
        {totalPage < 5 && pageArray.map(page => <li key={page} className={(page === currentPage) ? 'active' : ''}>
          <a href onClick={props.onRefresh({ currentPage: page }, false)}>
            {page}
          </a>
        </li>)}

        {totalPage > 4 && pageArray.map(page => <li
          key={page}
          className={(() => {
            if (page === currentPage) {
              return 'active';
            } else if (page !== 1 && page !== totalPage && (page < currentPage - 3 || page > currentPage + 3)) {
              return 'hidden';
            }
            return '';
          })()}
        >
          <a
            href
            onClick={(page === currentPage - 3 || page === currentPage + 3) ? e => e.preventDefault() : props.onRefresh({ currentPage: page }, false)}
          >
            {(page === currentPage - 3 || page === currentPage + 3) && page !== 1 && page !== totalPage ? '...' : page}
          </a>
        </li>)}
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
