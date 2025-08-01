import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';

export const RefundModal = ({ show, handleClose, payment, onConfirmRefund, isRefunding }) => {
    const [amount, setAmount] = useState('');
    
    useEffect(() => {
        if (payment) {
            setAmount(payment.montant);
        }
    }, [payment]);

    const handleConfirm = () => {
        if (parseFloat(amount) > parseFloat(payment.montant)) {
            alert("Le montant du remboursement ne peut pas dépasser le montant initial.");
            return;
        }
        onConfirmRefund({ id: payment.id, amount, reason: 'Refund requested by admin' });
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Rembourser la Transaction</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {payment && (
                    <>
                        <p>Vous êtes sur le point de rembourser la transaction <strong>{payment.transaction_id}</strong>.</p>
                        <p>Étudiant: <strong>{payment.inscription?.utilisateur?.nom} {payment.inscription?.utilisateur?.prenom}</strong></p>
                        <Form.Group>
                            <Form.Label>Montant à rembourser (Max: {payment.montant}€)</Form.Label>
                            <Form.Control type="number" value={amount} onChange={(e) => setAmount(e.target.value)} max={payment.montant} step="0.01" />
                        </Form.Group>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} disabled={isRefunding}>Annuler</Button>
                <Button variant="danger" onClick={handleConfirm} disabled={isRefunding}>
                    {isRefunding ? <><Spinner size="sm" /> Traitement...</> : `Confirmer le remboursement de ${amount}€`}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
export default RefundModal;