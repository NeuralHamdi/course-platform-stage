import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert, Spinner } from 'react-bootstrap';
import { FaMoneyBillWave } from 'react-icons/fa';

// API Functions
import { fetchPayments, fetchPaymentStats, refundPayment } from '../Api/paymentApi';

// Components
import PaymentDashboard from './payment/PaymentDashbord';
import PaymentFilters from './payment/PaymntFilters';
import PaymentTable from './payment/PaymentTable';
import CoursePagination from './Course/CoursePagination'; // Re-using pagination
import RefundModal from './payment/RefundModal';
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
        queryKey: ['paymentStats'],
        queryFn: fetchPaymentStats,
    });

    // Query for the list of payments
    const { data: paymentsData, isLoading, isError, isFetching, error } = useQuery({
        queryKey: ['payments', filters],
        queryFn: fetchPayments,
        keepPreviousData: true,
    });

    // Mutation for processing refunds
    const refundMutation = useMutation({
        mutationFn: refundPayment,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            queryClient.invalidateQueries({ queryKey: ['paymentStats'] });
            alert(data.message || 'Remboursement effectué avec succès!');
            setRefundTarget(null); // Close modal
        },
        onError: (error) => {
            alert(`Échec du remboursement: ${error.message}`);
        }
    });

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

            <RefundModal
                show={!!refundTarget}
                handleClose={() => setRefundTarget(null)}
                payment={refundTarget}
                onConfirmRefund={(refundData) => refundMutation.mutate(refundData)}
                isRefunding={refundMutation.isLoading}
            />
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
