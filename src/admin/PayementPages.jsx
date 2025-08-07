import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert, Spinner } from 'react-bootstrap';
import { FaMoneyBillWave } from 'react-icons/fa';
import { useMemo } from 'react';

// API Functions
import { fetchPayments, fetchPaymentStats } from '../Api/paymentApi';

// Components
import PaymentDashboard from './payment/PaymentDashbord';
import PaymentFilters from './payment/PaymntFilters';
import PaymentTable from './payment/PaymentTable';
import CoursePagination from './Course/CoursePagination'; // Re-using pagination

import PaymentDetailsModal from './payment/PaymentDetailsModal';

const PaymentsPage = () => {
    const [filters, setFilters] = useState({
        page: 1,
        student: '',
        transaction_id: '',
        status: '',
        startDate: '',
        endDate: '',
    });
    const [refundTarget, setRefundTarget] = useState(null); // To open the refund modal
    const [detailsTarget, setDetailsTarget] = useState(null); // To open the details modal
    const queryClient = useQueryClient();

    // Query for dashboard statistics
    const { data: statsData, isLoading: isLoadingStats } = useQuery({
        queryKey: ['paymentStats',filters],
        queryFn: fetchPaymentStats,
        keepPreviousData: true,
    });

    // Query for the list of payments
    const { data: paymentsData, isLoading, isError, isFetching, error } = useQuery({
        queryKey: ['payments', filters],
        queryFn: fetchPayments,
        keepPreviousData: true,
    });

    // Mutation for processing refunds
    
//      const stats = useMemo(() => {
//     const rows = paymentsData || [];
//     const totalTransactions = rows.length;
//     const totalRevenue = rows
//       .reduce((sum, row) => sum + parseFloat(row.montant), 0);
//     const averageSale = totalTransactions > 0
//       ? totalRevenue / totalTransactions
//       : 0;
//     return { totalRevenue, totalTransactions, averageSale };
//   }, [paymentsData.data]);

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    return (
        <div className="container-fluid py-4">
            <h2 className="mb-4"><FaMoneyBillWave className="me-2 text-success" />Gestion des Paiements</h2>

            <PaymentDashboard stats={statsData} isLoading={isLoadingStats} />
            <PaymentFilters filters={filters} setFilters={setFilters} />

            {isError && <Alert variant="danger">Erreur: {error.message}</Alert>}
            {isFetching && !isLoading && <div className="text-muted mb-2"><Spinner size="sm"/> Mise à jour...</div>}

            <PaymentTable
                data={paymentsData}
                isLoading={isLoading}
                onRefund={(payment) => setRefundTarget(payment)}
                onViewDetails={(payment) => setDetailsTarget(payment)}
            />
            
            <CoursePagination data={paymentsData} onPageChange={handlePageChange} />

         
            {/* The new Details Modal */}
            <PaymentDetailsModal
                show={!!detailsTarget}
                handleClose={() => setDetailsTarget(null)}
                payment={detailsTarget}
            />
        </div>
    );
};

export default PaymentsPage;