import React from 'react';
import { Pagination } from 'react-bootstrap';

const CoursePagination = ({ data, onPageChange }) => {
    if (!data || !data.links || data.links.length <= 3) {
        return null; // Don't render pagination if there's only one page
    }

    const handlePageClick = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= data.last_page) {
            onPageChange(pageNumber);
        }
    };

    return (
        <div className="d-flex justify-content-between align-items-center mt-3">
            <span className="text-muted">
                Affichage de {data.from || 0} à {data.to || 0} sur {data.total || 0} résultats
            </span>
            <Pagination className="mb-0">
                {/* First and Previous Buttons */}
                <Pagination.First onClick={() => handlePageClick(1)} disabled={data.current_page === 1} />
                <Pagination.Prev onClick={() => handlePageClick(data.current_page - 1)} disabled={data.current_page === 1} />

                {/* Page numbers from Laravel's link structure */}
                {data.links.map((link, index) => {
                    if (index === 0 || index === data.links.length - 1) return null; // Skip prev/next links
                    
                    const pageNumber = parseInt(link.label);
                    if (isNaN(pageNumber)) {
                        return <Pagination.Ellipsis key={index} />;
                    }

                    return (
                        <Pagination.Item
                            key={index}
                            active={link.active}
                            onClick={() => handlePageClick(pageNumber)}
                        >
                            {link.label}
                        </Pagination.Item>
                    );
                })}

                {/* Next and Last Buttons */}
                <Pagination.Next onClick={() => handlePageClick(data.current_page + 1)} disabled={data.current_page === data.last_page} />
                <Pagination.Last onClick={() => handlePageClick(data.last_page)} disabled={data.current_page === data.last_page} />
            </Pagination>
        </div>
    );
};

export default CoursePagination;
