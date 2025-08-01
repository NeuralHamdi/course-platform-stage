import React from 'react';
import { Card, Row, Col, Form } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext.jsx';


export const PaymentFilters = ({ filters, setFilters }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
    };
    
    return (
        <Card className="mb-4">
            <Card.Body>
                <Row className="g-3">
                    <Col md={4}>
                        <Form.Control type="text" name="student" placeholder="Chercher par étudiant (nom, email)..." value={filters.student} onChange={handleInputChange} />
                    </Col>
                    <Col md={4}>
                        <Form.Control type="text" name="transaction_id" placeholder="Chercher par ID de transaction..." value={filters.transaction_id} onChange={handleInputChange} />
                    </Col>
                    <Col md={4}>
                        <Form.Select name="status" value={filters.status} onChange={handleInputChange}>
                            <option value="">Tous les statuts</option>
                            <option value="completed">Complété</option>
                            <option value="failed">Échoué</option>
                            <option value="pending">En attente</option>
                            <option value="refunded">Remboursé</option>
                        </Form.Select>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};
export default PaymentFilters;