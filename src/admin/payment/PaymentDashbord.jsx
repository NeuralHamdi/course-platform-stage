import React, { useState } from 'react';
import { Row, Col, Card, Spinner, Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import { FaEuroSign, FaReceipt, FaUsers } from 'react-icons/fa';

import { useEffect } from 'react';

export const PaymentDashboard = ({ stats, isLoading }) => {
    if (isLoading) return <div className="text-center p-4"><Spinner animation="border" /></div>;

    const formatCurrency = (amount) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount || 0);

    return (
        <Row>
            <Col md={4} className="mb-4">
                <Card>
                    <Card.Body>
                        <div className="d-flex align-items-center">
                            <div className="flex-shrink-0 me-3"><FaEuroSign size={30} className="text-success" /></div>
                            <div className="flex-grow-1">
                                <Card.Title as="h6" className="text-muted">Revenu Total</Card.Title>
                                <Card.Text as="h4">{formatCurrency(stats?.totalRevenue)}</Card.Text>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={4} className="mb-4">
                <Card>
                    <Card.Body>
                        <div className="d-flex align-items-center">
                             <div className="flex-shrink-0 me-3"><FaReceipt size={30} className="text-primary" /></div>
                            <div className="flex-grow-1">
                                <Card.Title as="h6" className="text-muted">Transactions</Card.Title>
                                <Card.Text as="h4">{stats?.totalTransactions || 0}</Card.Text>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={4} className="mb-4">
                <Card>
                     <Card.Body>
                        <div className="d-flex align-items-center">
                             <div className="flex-shrink-0 me-3"><FaUsers size={30} className="text-info" /></div>
                            <div className="flex-grow-1">
                                <Card.Title as="h6" className="text-muted">Panier Moyen</Card.Title>
                                <Card.Text as="h4">{formatCurrency(stats?.averageSale)}</Card.Text>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};
export default PaymentDashboard;
