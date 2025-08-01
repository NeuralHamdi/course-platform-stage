import React from 'react';

const SessionPagination = ({ data, onPageChange }) => {
  if (!data || !data.last_page || data.last_page <= 1) {
    return null;
  }

  const currentPage = data.current_page;
  const lastPage = data.last_page;
  const pages = [];
  
  // Calculate which pages to show
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(lastPage, currentPage + 2);
  
  // Ensure we always show 5 pages if possible
  if (currentPage <= 3) {
    endPage = Math.min(5, lastPage);
  }
  
  if (currentPage >= lastPage - 2) {
    startPage = Math.max(1, lastPage - 4);
  }

  // First page + ellipsis if needed
  if (startPage > 1) {
    pages.push(
      <li key={1} className="page-item">
        <button
          className="page-link"
          onClick={() => onPageChange(1)}
        >
          1
        </button>
      </li>
    );
    if (startPage > 2) {
      pages.push(
        <li key="start-ellipsis" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
    }
  }
  
  // Main pages
  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
        <button
          className="page-link"
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      </li>
    );
  }
  
  // Last page + ellipsis if needed
  if (endPage < lastPage) {
    if (endPage < lastPage - 1) {
      pages.push(
        <li key="end-ellipsis" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
    }
    pages.push(
      <li key={lastPage} className="page-item">
        <button
          className="page-link"
          onClick={() => onPageChange(lastPage)}
        >
          {lastPage}
        </button>
      </li>
    );
  }

  return (
    <div className="card mt-3">
      <div className="card-body py-3">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="d-flex align-items-center">
              <span className="text-muted">
                Affichage de <strong>{data.from || 0}</strong> à <strong>{data.to || 0}</strong> sur <strong>{data.total || 0}</strong> sessions
              </span>
            </div>
          </div>
          <div className="col-md-6">
            <nav>
              <ul className="pagination justify-content-end mb-0">
                {/* Previous button */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Page précédente"
                  >
                    <span aria-hidden="true">&laquo;</span>
                  </button>
                </li>

                {/* Page numbers */}
                {pages}

                {/* Next button */}
                <li className={`page-item ${currentPage === lastPage ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => currentPage < lastPage && onPageChange(currentPage + 1)}
                    disabled={currentPage === lastPage}
                    aria-label="Page suivante"
                  >
                    <span aria-hidden="true">&raquo;</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionPagination;