// src/pages/DashboardPage.jsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../Api/apiClient';
import { 
    Container, 
    Row, 
    Col, 
    Card, 
    Spinner, 
    Alert, 
    ListGroup, 
    Button, 
    Badge,
    Modal,
    Table
} from 'react-bootstrap';
import { 
    FaUser, 
    FaEnvelope, 
    FaBriefcase, 
    FaGraduationCap, 
    FaPhone, 
    FaVenusMars, 
    FaCalendarAlt,
    FaMoneyBillWave,
    FaCheckCircle,
    FaClock,
    FaUsers,
    FaPrint,
    FaReceipt,
    FaDownload,
    FaHourglassHalf,
    FaTimesCircle
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedInscription, setSelectedInscription] = useState(null);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['dashboardData'],
        queryFn: async () => {
            const response = await apiClient.get('/dashboard');
            return response.data;
        }
    });

    const getStatusBadge = (status) => {
        const statusConfig = {
            'confirmee': { variant: 'success', text: 'Confirmée', icon: <FaCheckCircle /> },
            'en_attente': { variant: 'warning', text: 'En attente', icon: <FaClock /> },
            'annulee': { variant: 'danger', text: 'Annulée', icon: <FaTimesCircle /> },
            'a_venir': { variant: 'info', text: 'À venir', icon: <FaClock /> },
            'en_cours': { variant: 'primary', text: 'En cours', icon: null },
            'terminee': { variant: 'secondary', text: 'Terminée', icon: null },
            'active': { variant: 'success', text: 'Active', icon: null }
        };
        
        const config = statusConfig[status] || { variant: 'secondary', text: status, icon: null };
        return (
            <Badge bg={config.variant} className="d-flex align-items-center gap-1">
                {config.icon} {config.text}
            </Badge>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleShowPaymentProof = (inscription) => {
        setSelectedInscription(inscription);
        setShowPaymentModal(true);
    };

    const handlePrintPaymentProof = () => {
        window.print();
    };

    // Fonction pour télécharger le reçu
    const downloadReceipt = async (inscriptionId) => {
        try {
            const response = await apiClient.get(`/payments/receipt/${inscriptionId}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `recu-${inscriptionId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Error downloading receipt:', err);
            alert('Erreur lors du téléchargement du reçu');
        }
    };

    // Fonction pour rendre une formation
    const renderFormation = (inscription) => (
        <div key={inscription.id} className="border-bottom p-4">
            <Row className="align-items-start">
                <Col md={8}>
                    <div className="mb-3">
                        <h5 className="text-dark mb-1">
                            {inscription.session.cours.titre}
                        </h5>
                        <p className="text-muted mb-2">
                            Session: <strong>{inscription.session.titre}</strong>
                        </p>
                        <div className="d-flex flex-wrap gap-2 mb-3">
                            {getStatusBadge(inscription.statut)}
                            {getStatusBadge(inscription.session.statut)}
                            <Badge bg="secondary">
                                Niveau {inscription.session.cours.niveau}
                            </Badge>
                        </div>
                    </div>
                    
                    <Row className="g-3 text-sm">
                        <Col sm={6}>
                            <div className="d-flex align-items-center text-muted">
                                <FaCalendarAlt className="me-2" />
                                <div>
                                    <small className="d-block">Début de formation</small>
                                    <strong className="text-dark">
                                        {formatDate(inscription.session.date_debut)}
                                    </strong>
                                </div>
                            </div>
                        </Col>
                        <Col sm={6}>
                            <div className="d-flex align-items-center text-muted">
                                <FaCalendarAlt className="me-2" />
                                <div>
                                    <small className="d-block">Fin de formation</small>
                                    <strong className="text-dark">
                                        {formatDate(inscription.session.date_fin)}
                                    </strong>
                                </div>
                            </div>
                        </Col>
                        <Col sm={6}>
                            <div className="d-flex align-items-center text-muted">
                                <FaMoneyBillWave className="me-2" />
                                <div>
                                    <small className="d-block">Montant payé</small>
                                    <strong className="text-success">
                                        {inscription.montant_paye} MAD
                                    </strong>
                                </div>
                            </div>
                        </Col>
                        <Col sm={6}>
                            <div className="d-flex align-items-center text-muted">
                                <FaUsers className="me-2" />
                                <div>
                                    <small className="d-block">Places disponibles</small>
                                    <strong className="text-dark">
                                        {inscription.session.places_disponibles}/{inscription.session.capacite_maximale}
                                    </strong>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Col>
                
                <Col md={4} className="text-md-end">
                    <div className="d-flex flex-column gap-2">
                        {inscription.statut === 'confirmee' ? (
                            <>
                                <Button 
                                    as={Link} 
                                    to={`/courses/${inscription.session.cours.id}/content`} 
                                    variant="primary"
                                    size="sm"
                                >
                                    Accéder au cours
                                </Button>
                                <Button 
                                    variant="outline-success" 
                                    size="sm"
                                    onClick={() => downloadReceipt(inscription.id)}
                                >
                                    <FaDownload className="me-1" />
                                    Télécharger reçu
                                </Button>
                            </>
                        ) : inscription.statut === 'en_attente' ? (
                            <>
                                <Button 
                                    as={Link} 
                                    to={`/inscription/${inscription.session_id}`}
                                    variant="warning"
                                    size="sm"
                                >
                                    Finaliser votre commande
                                </Button>
                                <Button 
                                    variant="outline-secondary" 
                                    size="sm"
                                    onClick={() => handleShowPaymentProof(inscription)}
                                >
                                    <FaReceipt className="me-1" />
                                    Voir détails
                                </Button>
                            </>
                        ) : (
                            <Button 
                                variant="outline-secondary" 
                                size="sm"
                                onClick={() => handleShowPaymentProof(inscription)}
                            >
                                <FaReceipt className="me-1" />
                                Preuve de paiement
                            </Button>
                        )}
                    </div>
                    <small className="text-muted d-block mt-2">
                        Inscrit le {formatDate(inscription.date_inscription)}
                    </small>
                </Col>
            </Row>
        </div>
    );

    if (isLoading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" variant="primary" size="lg" />
                <p className="mt-3 text-muted">Chargement de votre tableau de bord...</p>
            </Container>
        );
    }

    if (isError) {
        return (
            <Container className="py-5">
                <Alert variant="danger">
                    <Alert.Heading>Erreur de chargement</Alert.Heading>
                    <p>{error.message}</p>
                </Alert>
            </Container>
        );
    }

    const { user, inscriptions } = data;

    // Séparer les formations par statut
    const formationsConfirmees = inscriptions.filter(inscription => inscription.statut === 'confirmee');
    const formationsEnAttente = inscriptions.filter(inscription => inscription.statut === 'en_attente');
    const autresFormations = inscriptions.filter(inscription => !['confirmee', 'en_attente'].includes(inscription.statut));

    return (
        <div className="bg-light py-5 min-vh-100">
            <Container>
                {/* Welcome Header */}
                <div className="bg-white rounded shadow-sm p-4 mb-4">
                    <h1 className="text-primary mb-2">
                        Bienvenue, {user.prenom} {user.nom}! 👋
                    </h1>
                    <p className="text-muted mb-0">
                        Membre depuis le {formatDate(user.date_inscription)}
                    </p>
                </div>

                <Row>
                    {/* User Information Card */}
                    <Col lg={4} className="mb-4">
                        <Card className="shadow-sm h-100">
                            <Card.Header className="bg-gradient bg-primary text-white">
                                <h5 className="mb-0">
                                    <FaUser className="me-2" />
                                    Mes Informations
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <ListGroup variant="flush">
                                    <ListGroup.Item className="border-0 px-0 py-2">
                                        <div className="d-flex align-items-center">
                                            <FaUser className="me-3 text-primary" />
                                            <div>
                                                <small className="text-muted d-block">Nom complet</small>
                                                <strong>{user.prenom} {user.nom}</strong>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item className="border-0 px-0 py-2">
                                        <div className="d-flex align-items-center">
                                            <FaEnvelope className="me-3 text-primary" />
                                            <div>
                                                <small className="text-muted d-block">Email</small>
                                                <strong>{user.email}</strong>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item className="border-0 px-0 py-2">
                                        <div className="d-flex align-items-center">
                                            <FaPhone className="me-3 text-primary" />
                                            <div>
                                                <small className="text-muted d-block">Téléphone</small>
                                                <strong>{user.telephone || 'Non fourni'}</strong>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item className="border-0 px-0 py-2">
                                        <div className="d-flex align-items-center">
                                            <FaVenusMars className="me-3 text-primary" />
                                            <div>
                                                <small className="text-muted d-block">Sexe</small>
                                                <strong className="text-capitalize">{user.sexe || 'Non fourni'}</strong>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item className="border-0 px-0 py-2">
                                        <div className="d-flex align-items-center">
                                            <FaBriefcase className="me-3 text-primary" />
                                            <div>
                                                <small className="text-muted d-block">Profession</small>
                                                <strong>{user.profession || 'Non fourni'}</strong>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item className="border-0 px-0 py-2">
                                        <div className="d-flex align-items-center">
                                            <FaGraduationCap className="me-3 text-primary" />
                                            <div>
                                                <small className="text-muted d-block">Niveau d'études</small>
                                                <strong>{user.niveau_Etudes || 'Non fourni'}</strong>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                </ListGroup>

                                {/* Statistiques rapides */}
                                <div className="mt-4 pt-3 border-top">
                                    <Row className="text-center">
                                        <Col xs={4}>
                                            <div className="text-success">
                                                <strong className="d-block fs-4">{formationsConfirmees.length}</strong>
                                                <small className="text-muted">Confirmées</small>
                                            </div>
                                        </Col>
                                        <Col xs={4}>
                                            <div className="text-warning">
                                                <strong className="d-block fs-4">{formationsEnAttente.length}</strong>
                                                <small className="text-muted">En attente</small>
                                            </div>
                                        </Col>
                                        <Col xs={4}>
                                            <div className="text-primary">
                                                <strong className="d-block fs-4">{formationsEnAttente.length+formationsConfirmees.length}</strong>
                                                <small className="text-muted">Total</small>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Formations Column */}
                    <Col lg={8}>
                        {/* Formations Confirmées */}
                        {formationsConfirmees.length > 0 && (
                            <Card className="shadow-sm mb-4">
                                <Card.Header className="bg-success text-white">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0">
                                            <FaCheckCircle className="me-2" />
                                            Formations Confirmées ({formationsConfirmees.length})
                                        </h5>
                                        <Badge bg="light" text="success" pill>
                                            Accès autorisé
                                        </Badge>
                                    </div>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    {formationsConfirmees.map(inscription => renderFormation(inscription))}
                                </Card.Body>
                            </Card>
                        )}

                        {/* Formations en Attente */}
                        {formationsEnAttente.length > 0 && (
                            <Card className="shadow-sm mb-4">
                                <Card.Header className="bg-warning text-dark">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0">
                                            <FaHourglassHalf className="me-2" />
                                            Formations en Attente ({formationsEnAttente.length})
                                        </h5>
                                        <Badge bg="light" text="warning" pill>
                                            En cours de validation
                                        </Badge>
                                    </div>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <div className="alert alert-warning m-3 mb-0">
                                        <FaClock className="me-2" />
                                        <strong>Information:</strong> Ces formations sont en attente de confirmation de paiement. 
                                        L'accès sera autorisé une fois le paiement validé.
                                    </div>
                                    {formationsEnAttente.map(inscription => renderFormation(inscription))}
                                </Card.Body>
                            </Card>
                        )}

                        {/* Autres Formations (Annulées, Terminées, etc.) */}
                

                        {/* Message si aucune formation */}
                        {inscriptions.length === 0 && (
                            <Card className="shadow-sm">
                                <Card.Body className="text-center py-5">
                                    <FaGraduationCap size={48} className="text-muted mb-3" />
                                    <h5 className="text-muted">Aucune formation</h5>
                                    <p className="text-muted">Vous n'êtes inscrit à aucune formation pour le moment.</p>
                                    <Button as={Link} to="/Programs" variant="primary">
                                        Découvrir nos formations
                                    </Button>
                                </Card.Body>
                            </Card>
                        )}
                    </Col>
                </Row>
            </Container>

            {/* Payment Proof Modal */}
            <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FaReceipt className="me-2" />
                        Preuve de Paiement
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedInscription && (
                        <div className="payment-proof" id="payment-proof">
                            <div className="text-center mb-4 pb-3 border-bottom">
                                <h4 className="text-primary">REÇU DE PAIEMENT</h4>
                                <p className="text-muted mb-0">Formation en ligne</p>
                            </div>
                            
                            <Table borderless className="mb-4">
                                <tbody>
                                    <tr>
                                        <td><strong>Numéro d'inscription:</strong></td>
                                        <td>#{selectedInscription.id.toString().padStart(6, '0')}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Étudiant:</strong></td>
                                        <td>{user.prenom} {user.nom}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Email:</strong></td>
                                        <td>{user.email}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Formation:</strong></td>
                                        <td>{selectedInscription.session.cours.titre}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Session:</strong></td>
                                        <td>{selectedInscription.session.titre}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Date d'inscription:</strong></td>
                                        <td>{formatDateTime(selectedInscription.date_inscription)}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Statut du paiement:</strong></td>
                                        <td>{getStatusBadge(selectedInscription.statut)}</td>
                                    </tr>
                                    <tr className="border-top">
                                        <td><strong>Montant payé:</strong></td>
                                        <td><strong className="text-success fs-5">{selectedInscription.montant_paye} MAD</strong></td>
                                    </tr>
                                </tbody>
                            </Table>
                            
                            <div className="bg-light p-3 rounded">
                                <p className="mb-0 text-center text-muted">
                                    <small>
                                        Ce document atteste du paiement effectué pour la formation mentionnée ci-dessus.
                                        <br />
                                        Généré le {formatDateTime(new Date().toISOString())}
                                    </small>
                                </p>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
                        Fermer
                    </Button>
                    <Button variant="primary" onClick={handlePrintPaymentProof}>
                        <FaPrint className="me-1" />
                        Imprimer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default DashboardPage;