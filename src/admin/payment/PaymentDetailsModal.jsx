import React from 'react';
import { Modal, Button, ListGroup, Badge } from 'react-bootstrap';

const PaymentDetailsModal = ({ show, handleClose, payment }) => {
    if (!payment) return null;

    // Helper to format date strings
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('fr-FR');
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return <Badge bg="success">Complété</Badge>;
            case 'pending':
                return <Badge bg="warning">En attente</Badge>;
            case 'failed':
                return <Badge bg="danger">Échoué</Badge>;
            default:
                return <Badge bg="secondary">{status}</Badge>;
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Détails du Paiement #{payment.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup variant="flush">
                    {/* Payment Information */}
                    <ListGroup.Item className="d-flex justify-content-between align-items-start">
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">Montant</div>
                            {payment.montant} MAD
                        </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-start">
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">Statut</div>
                            {getStatusBadge(payment.status)}
                        </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-start">
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">ID de Transaction</div>
                            {payment.transaction_id}
                        </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-start">
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">Date de Paiement</div>
                            {formatDate(payment.date_paiement)}
                        </div>
                    </ListGroup.Item>
                     <ListGroup.Item className="d-flex justify-content-between align-items-start">
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">Méthode</div>
                            {payment.methode_paiement}
                        </div>
                    </ListGroup.Item>

                    {/* Student Information */}
                    <ListGroup.Item className="d-flex justify-content-between align-items-start mt-3">
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">Étudiant</div>
                            {payment.inscription.utilisateur.prenom} {payment.inscription.utilisateur.nom}
                        </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-start">
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">Email</div>
                            {payment.inscription.utilisateur.email}
                        </div>
                    </ListGroup.Item>

                    {/* Enrollment Information */}
                    <ListGroup.Item className="d-flex justify-content-between align-items-start mt-3">
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">Cours</div>
                            {payment.inscription.session.cours.titre}
                        </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-start">
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">Session</div>
                            {payment.inscription.session.titre}
                        </div>
                    </ListGroup.Item>
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Fermer
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PaymentDetailsModal;