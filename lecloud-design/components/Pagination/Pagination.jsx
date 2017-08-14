import React from 'react';
import './Pagination.scss';

class Pagination extends React.Component {

  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { currentPage, totalPage, total, onClick } = this.props;
    const pageArray = [];
    for (let i = 1; i < totalPage + 1; i += 1) {
      pageArray.push(i);
    }

    return (
      <div className="pagination">
        <ul>
          <li key="left">
            <a
              href
              onClick={(e) => {
                e.preventDefault();
                if (currentPage - 1 >= 1) {
                  onClick(currentPage - 1);
                }
              }}
              className={currentPage - 1 < 1 ? 'pagination-disabled' : ''}
            >
              &lt;
            </a>
          </li>

          {totalPage < 5 && pageArray.map(page =>
            <li
              key={page}
              className={(page === currentPage) ? 'pagination-active' : ''}
            >
              <a
                href
                onClick={(e) => {
                  e.preventDefault();
                  onClick(page);
                }}
              >
                {page}
              </a>
            </li>)
          }

          {totalPage > 4 && pageArray.map(page =>
            <li
              key={page}
              className={(() => {
                if (page === currentPage) {
                  return 'pagination-active';
                } else if (page !== 1 && page !== totalPage && (page < currentPage - 3 || page > currentPage + 3)) {
                  return 'pagination-hidden';
                } else if ((page === currentPage - 3 || page === currentPage + 3) && page !== 1 && page !== totalPage) {
                  return 'pagination-ellipsis';
                }
                return '';
              })()}
            >
              <a
                href
                onClick={(page === currentPage - 3 || page === currentPage + 3) ?
                  e => e.preventDefault() :
                  (e) => {
                    e.preventDefault();
                    onClick(page);
                  }
                }
              >
                {(page === currentPage - 3 || page === currentPage + 3) && page !== 1 && page !== totalPage ? '...' : page}
              </a>
            </li>
          )}

          <li key="right">
            <a
              href
              onClick={(e) => {
                e.preventDefault();
                if (currentPage + 1 <= totalPage) {
                  onClick(currentPage + 1);
                }
              }}
              className={currentPage + 1 > totalPage ? 'pagination-disabled' : ''}
            >
              &gt;
            </a>
          </li>
        </ul>

        <span>
          {`共 ${total} 条`}
        </span>
      </div>
    );
  }
}

Pagination.defaultProps = {};

Pagination.propTypes = {
  currentPage: React.PropTypes.number.isRequired,
  totalPage: React.PropTypes.number.isRequired,
  onClick: React.PropTypes.func,
  total: React.PropTypes.number,
};

export default Pagination;
