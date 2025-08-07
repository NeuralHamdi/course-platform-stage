import React from 'react';
import { Table, Badge, Button, Spinner } from 'react-bootstrap';
import { FaEye,FaUndo } from 'react-icons/fa';

export const PaymentTable = ({ data, isLoading, onRefund ,onViewDetails}) => {
    const getStatusBadge = (status) => {
        const map = {
            completed: { bg: 'success', text: 'Complété' },
            failed: { bg: 'danger', text: 'Échoué' },
            pending: { bg: 'warning', text: 'En attente' },
            refunded: { bg: 'secondary', text: 'Remboursé' },
        };
        return map[status] || { bg: 'light', text: status };
    };

    if (isLoading) return <div className="text-center p-5"><Spinner animation="border" /></div>;

    return (
        <Table striped bordered hover responsive>
            <thead className="table-light">
                <tr>
                    <th>ID Pyement</th>
                    <th>Statut</th>
                    <th>Étudiant</th>
                    <th>Session / Cours</th>
                    <th>Montant</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {data?.data?.length > 0 ? data.data.map(p => (
                    <tr key={p.id}>
                        <td><small>{p.inscription_id}</small></td>
                        <td><Badge bg={getStatusBadge(p.status).bg}>{getStatusBadge(p.status).text}</Badge></td>
                        <td>{p.inscription?.utilisateur?.nom} {p.inscription?.utilisateur?.prenom}</td>
                        <td>{p.inscription?.session?.cours?.titre || 'N/A'}</td>
                        <td>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(p.montant)}</td>
                        <td>{new Date(p.date_paiement).toLocaleString('fr-FR')}</td>
                        <td>
                           
                              <Button variant="info" size="sm" className="me-2" onClick={() => onViewDetails(p)}>
                            <FaEye />
                                 </Button>
                        </td>
                    </tr>
                )) : (
                    <tr><td colSpan="7" className="text-center">Aucun paiement trouvé.</td></tr>
                )}
            </tbody>
        </Table>
    );
};
export default PaymentTable;