import apiClient from './apiClient';

/**
 * Fetches payment statistics for the dashboard.
 */
export const fetchPaymentStats = async () => {
    const response = await apiClient.get('/payments/stats');
    return response.data;
};

/**
 * Fetches a paginated list of payments with filters.
 */
export const fetchPayments = async ({ queryKey }) => {
    const [, { page, student, transaction_id, status, startDate, endDate }] = queryKey;
    const response = await apiClient.get('/payments', {
        params: {
            page,
            student: student || undefined,
            transaction_id: transaction_id || undefined,
            status: status || undefined,
            start_date: startDate || undefined,
            end_date: endDate || undefined,
        },
    });
    return response.data;
};

/**
 * Processes a refund for a transaction.
 */
export const refundPayment = async ({ id, amount, reason }) => {
    const response = await apiClient.post(`/payments/${id}/refund`, { amount, reason });
    return response.data;
};
