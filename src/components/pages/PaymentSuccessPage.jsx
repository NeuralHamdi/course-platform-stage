import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { FaCheckCircle, FaDownload, FaCalendarAlt, FaHome, FaEuroSign } from 'react-icons/fa';
import apiClient from '../../Api/apiClient';

const PaymentSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const inscriptionId = searchParams.get('inscription_id');
    
    const pollingIntervalRef = useRef(null);
    const pollingTimeoutRef = useRef(null);

    useEffect(() => {
        const stopPolling = () => {
            clearInterval(pollingIntervalRef.current);
            clearTimeout(pollingTimeoutRef.current);
        };

        const fetchPaymentStatus = async () => {
            try {
                const response = await apiClient.get(`/payments/status/${inscriptionId}`);
                console.log('API Response:', response.data); // Pour debugging
                
                setPaymentData(response.data);
                
                // 🔧 FIX: Adaptez selon la structure réelle de votre API
                const paymentStatus = response.data?.payment_status;
                const inscriptionStatus = response.data?.statut;
                
                // Considérer comme terminé si payment_status est 'completed' et statut n'est plus 'en_attente'
                if (paymentStatus === 'completed' || inscriptionStatus === 'confirmee' || inscriptionStatus === 'annulee') {
                    setLoading(false);
                    stopPolling();
                }
            } catch (err) {
                setError('Erreur lors de la vérification du paiement');
                console.error('Error fetching payment status:', err);
                setLoading(false);
                stopPolling();
            }
        };

        const initializePaymentCheck = async () => {
            if (!inscriptionId) {
                setError("ID d'inscription manquant dans l'URL.");
                setLoading(false);
                return;
            }

            try {
                // Sync avec Stripe
                await apiClient.post(`/payments/sync/${inscriptionId}`);
                
                // Fetch status initial
                const initialResponse = await apiClient.get(`/payments/status/${inscriptionId}`);
                console.log('Initial API Response:', initialResponse.data); // Pour debugging
                
                setPaymentData(initialResponse.data);
                
                // 🔧 FIX: Vérifiez selon la structure de votre API
                const paymentStatus = initialResponse.data?.payment_status;
                const inscriptionStatus = initialResponse.data?.statut;
                
                if (paymentStatus === 'completed' && inscriptionStatus !== 'en_attente') {
                    setLoading(false);
                } else if (paymentStatus === 'failed' || inscriptionStatus === 'annulee') {
                    setLoading(false);
                } else {
                    // Continuer le polling
                    pollingIntervalRef.current = setInterval(fetchPaymentStatus, 3000);
                    pollingTimeoutRef.current = setTimeout(() => {
                        stopPolling();
                        setError("La vérification a expiré. Veuillez vérifier votre tableau de bord ou contacter le support.");
                        setLoading(false);
                    }, 60000);
                }
            } catch (initError) {
                console.error('Error during initial sync/fetch:', initError);
                setError("Une erreur est survenue lors de la confirmation. Veuillez rafraîchir la page.");
                setLoading(false);
            }
        };

        initializePaymentCheck();

        return () => {
            stopPolling();
        };
    }, [inscriptionId]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const downloadReceipt = async () => {
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

    if (loading) {
        return (
            <div className="container py-5 d-flex justify-content-center">
                <Card className="text-center border-0 shadow-sm" style={{width: '24rem'}}>
                    <Card.Body className="py-5">
                        <Spinner animation="border" className="mb-3" />
                        <h5>Vérification de votre paiement...</h5>
                    </Card.Body>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">
                <Alert variant="danger" className="text-center">
                    <h5>Erreur</h5>
                    <p>{error}</p>
                    <Button variant="primary" onClick={() => navigate('/')}>Retour à l'accueil</Button>
                </Alert>
            </div>
        );
    }

    // 🔧 FIX: Adaptez selon votre structure API
    const isPaymentSuccessful = paymentData?.payment_status === 'completed';
    const isPaymentFailed = paymentData?.payment_status === 'failed' || paymentData?.statut === 'annulee';

    return (
        <div className="container py-5">
            <Row className="justify-content-center">
                <Col lg={8}>
                    {isPaymentSuccessful ? (
                        <>
                            {/* Success Header */}
                            <Card className="border-0 shadow-sm mb-4 bg-success text-white">
                                <Card.Body className="text-center py-4">
                                    <FaCheckCircle size={48} className="mb-3" />
                                    <h2 className="mb-2">Paiement réussi !</h2>
                                    <p className="mb-0 fs-5">
                                        Votre inscription a été confirmée avec succès
                                    </p>
                                </Card.Body>
                            </Card>

                            {/* Payment Details - Adaptés à votre structure API */}
                            <Card className="border-0 shadow-sm mb-4">
                                <Card.Header className="bg-light border-0">
                                    <h5 className="mb-0">Détails de votre inscription</h5>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={6}>
                                            <h6 className="text-primary">Session</h6>
                                            <p className="mb-2">{paymentData.session_info?.titre || 'Information non disponible'}</p>
                                            
                                            <h6 className="text-primary mt-3">Date de début</h6>
                                            <p className="mb-0">
                                                <FaCalendarAlt className="me-2" />
                                                {formatDate(paymentData.session_info?.date_debut)}
                                            </p>
                                        </Col>
                                        
                                        <Col md={6}>
                                            <h6 className="text-primary">ID Inscription</h6>
                                            <p className="mb-2">{paymentData.inscription_id}</p>
                                            
                                            <h6 className="text-primary mt-3">Statut du paiement</h6>
                                            <p className="mb-0 fs-5 text-success fw-bold">
                                                <FaCheckCircle className="me-1" />
                                                {paymentData.payment_status === 'completed' ? 'Confirmé' : paymentData.payment_status}
                                            </p>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            {/* Next Steps */}
                            <Card className="border-0 shadow-sm mb-4 bg-light">
                                <Card.Body>
                                    <h6 className="text-primary mb-3">Prochaines étapes</h6>
                                    <ul className="list-unstyled mb-0">
                                        <li><FaCheckCircle className="text-success me-2" />Un email de confirmation vous a été envoyé.</li>
                                        <li className="mt-2"><FaCheckCircle className="text-success me-2" />Vous recevrez les détails de connexion avant le début du cours.</li>
                                        <li className="mt-2"><FaCheckCircle className="text-success me-2" />Téléchargez votre reçu de paiement ci-dessous.</li>
                                    </ul>
                                </Card.Body>
                            </Card>

                            {/* Action Buttons */}
                            <div className="d-flex gap-2 flex-wrap justify-content-center">
                                <Button 
                                    variant="outline-primary" 
                                    onClick={downloadReceipt}
                                    className="d-flex align-items-center"
                                >
                                    <FaDownload className="me-2" />
                                    Télécharger le reçu
                                </Button>
                                
                                <Button 
                                    variant="primary" 
                                    onClick={() => navigate('/dashboard')}
                                    className="d-flex align-items-center"
                                >
                                    <FaCalendarAlt className="me-2" />
                                    Voir mes cours
                                </Button>
                                
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={() => navigate('/')}
                                    className="d-flex align-items-center"
                                >
                                    <FaHome className="me-2" />
                                    Accueil
                                </Button>
                            </div>
                        </>
                    ) : isPaymentFailed ? (
                        <Alert variant="danger" className="text-center">
                            <h5>Paiement Échoué ou Annulé</h5>
                            <p>Il y a eu un problème avec votre paiement ou la session a expiré. Aucuns frais n'ont été appliqués.</p>
                            <Button variant="primary" onClick={() => navigate('/')}>Retour à l'accueil</Button>
                        </Alert>
                    ) : (
                        <Alert variant="info" className="text-center">
                            <Spinner animation="border" size="sm" className="me-2" />
                            <strong>Paiement en cours de traitement...</strong>
                            <p className="mb-0 mt-2">Cette page se mettra à jour automatiquement une fois la vérification terminée.</p>
                            
                            {/* Debug info - À supprimer en production */}
                            <details className="mt-3">
                                <summary>Debug Info (à supprimer en production)</summary>
                                <pre className="text-start mt-2" style={{fontSize: '12px'}}>
                                    {JSON.stringify(paymentData, null, 2)}
                                </pre>
                            </details>
                        </Alert>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default PaymentSuccessPage;