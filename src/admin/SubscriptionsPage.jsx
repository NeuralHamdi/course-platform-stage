import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
import { Alert, Spinner, Table, Card } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from '../Api/apiClient';
import { useAuth } from '../context/AuthContext';

// API function to fetch subscriptions
const fetchSubscriptions = async (page = 1) => {
    try {
        const response = await apiClient.get(`/admin/subscriptions?page=${page}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors du chargement des abonnements');
    }
};

// Pagination component
const SubscriptionPagination = ({ data, onPageChange }) => {
    if (!data || data.total_pages <= 1) return null;

    const { current_page, total_pages } = data;
    const pages = [];

    for (let i = 1; i <= total_pages; i++) {
        pages.push(i);
    }

    return (
        <div className="d-flex justify-content-center mt-4">
            <nav>
                <ul className="pagination">
                    <li className={`page-item ${current_page === 1 ? 'disabled' : ''}`}>
                        <button 
                            className="page-link" 
                            onClick={() => onPageChange(current_page - 1)}
                            disabled={current_page === 1}
                        >
                            Précédent
                        </button>
                    </li>
                    
                    {pages.map(page => (
                        <li key={page} className={`page-item ${current_page === page ? 'active' : ''}`}>
                            <button 
                                className="page-link" 
                                onClick={() => onPageChange(page)}
                            >
                                {page}
                            </button>
                        </li>
                    ))}
                    
                    <li className={`page-item ${current_page === total_pages ? 'disabled' : ''}`}>
                        <button 
                            className="page-link" 
                            onClick={() => onPageChange(current_page + 1)}
                            disabled={current_page === total_pages}
                        >
                            Suivant
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

// Subscriptions table component
const SubscriptionsTable = ({ data, isLoading }) => {
    if (isLoading) {
        return (
            <div className="text-center p-5">
                <Spinner animation="border" />
                <p className="mt-2">Chargement des abonnements...</p>
            </div>
        );
    }

    if (!data || !data.subscriptions || data.subscriptions.length === 0) {
        return (
            <div className="text-center p-5">
                <FaEnvelope size={48} className="text-muted mb-3" />
                <h5>Aucun abonnement trouvé</h5>
                <p className="text-muted">Il n'y a pas encore d'abonnements enregistrés.</p>
            </div>
        );
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Card>
            <Card.Header>
                <h5 className="mb-0">
                    <FaEnvelope className="me-2 text-primary" />
                    Liste des Abonnements ({data.total_subscriptions})
                </h5>
            </Card.Header>
            <Card.Body className="p-0">
                <Table responsive striped hover className="mb-0">
                    <thead className="table-dark">
                        <tr>
                            <th>Email</th>
                            <th>Date d'abonnement</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.subscriptions.map((subscription, index) => (
                            <tr key={index}>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <FaEnvelope className="text-primary me-2" size={16} />
                                        {subscription.email}
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <FaCalendarAlt className="text-muted me-2" size={14} />
                                        {formatDate(subscription.created_at)}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};

// Main subscriptions page component
const SubscriptionsPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { token } = useAuth();

    // Query for subscriptions
    const { data, isLoading, isError, error, isFetching } = useQuery({
        queryKey: ['subscriptions', currentPage],
        queryFn: () => fetchSubscriptions(currentPage),
        keepPreviousData: true,
        onError: (error) => {
            toast.error(error.message || 'Erreur lors du chargement des abonnements');
        }
    });

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="container-fluid">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />

            <div className="row">
                <div className="col-12">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="h3 mb-0">
                            <FaEnvelope className="me-2 text-primary" />
                            Gestion des Abonnements
                        </h2>
                        {data && (
                            <div className="text-muted">
                                Total: {data.total_subscriptions} abonnements
                            </div>
                        )}
                    </div>

                    {/* Loading indicator for pagination */}
                    {isFetching && !isLoading && (
                        <div className="text-muted mb-2">
                            <Spinner size="sm" /> Chargement...
                        </div>
                    )}

                    {/* Error state */}
                    {isError && (
                        <Alert variant="danger">
                            Erreur: {error.message}
                        </Alert>
                    )}

                    {/* Subscriptions table */}
                    <SubscriptionsTable data={data} isLoading={isLoading} />

                    {/* Pagination */}
                    {data && <SubscriptionPagination data={data} onPageChange={handlePageChange} />}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionsPage;