import React, { useState } from 'react';
import { Card, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { FaCreditCard, FaLock, FaShieldAlt, FaArrowLeft } from 'react-icons/fa';
import apiClient from '../Api/apiClient';

const PaymentCheckout = ({ selectedSession, currentUser, onBack, onPaymentStart }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const syncPaymentStatus = async (inscriptionId) => {
  try {
    const response = await apiClient.post(`/payments/sync/${inscriptionId}`);
    if (response.data.synced && response.data.inscription_status === 'confirmee') {
      window.location.href = '/dashboard'; // ou une autre redirection
    }
  } catch (error) {
    console.error('Erreur de synchronisation :', error);
  }
};


  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      onPaymentStart?.();

      const response = await apiClient.post('/payments/create-checkout', {
        session_id: selectedSession.id,
        etudiant_id: currentUser.id,
      });

      // Redirect to Stripe Checkout
      window.location.href = response.data.checkout_url;

    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la création du paiement');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedSession) {
    return (
      <Alert variant="warning">
        <h6>Aucune session sélectionnée</h6>
        <p className="mb-0">Veuillez d'abord sélectionner une session pour continuer.</p>
      </Alert>
    );
  }

  return (
    <div>
      <div className="d-flex align-items-center mb-4">
        <Button variant="outline-secondary" onClick={onBack} className="me-3">
          <FaArrowLeft className="me-2" />
          Retour
        </Button>
        <h4 className="mb-0">
          <FaCreditCard className="me-2 text-primary" />
          Finaliser votre inscription
        </h4>
      </div>

      <Row>
        <Col lg={8}>
          {/* Order Summary */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-light border-0">
              <h5 className="mb-0">Récapitulatif de votre commande</h5>
            </Card.Header>
            <Card.Body>
              <div className="row">
                <div className="col-md-4">
                  <img 
                    src={selectedSession.cours?.url_image || '/api/placeholder/300/200'} 
                    alt={selectedSession.cours?.titre}
                    className="img-fluid rounded"
                    style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                  />
                </div>
                <div className="col-md-8">
                  <h6 className="text-primary">{selectedSession.cours?.titre}</h6>
                  <h5 className="mb-2">{selectedSession.titre}</h5>
                  <p className="text-muted mb-2">{selectedSession.cours?.description}</p>
                  
                  <div className="row g-2">
                    <div className="col-sm-6">
                      <small className="text-muted">Date de début:</small>
                      <div className="fw-medium">{formatDate(selectedSession.date_debut)}</div>
                    </div>
                    {selectedSession.date_fin_inscription && (
                      <div className="col-sm-6">
                        <small className="text-muted">Date de fin d'inscription:</small>
                        <div className="fw-medium">{formatDate(selectedSession.date_fin_inscription)}</div>
                      </div>
                    )}
                        {selectedSession.date_fin && (
                      <div className="col-sm-6">
                        <small className="text-muted">Date de fin:</small>
                        <div className="fw-medium">{formatDate(selectedSession.date_fin)}</div>
                      </div>
                    )}
                    <div className="col-sm-6">
                      <small className="text-muted">Places disponibles:</small>
                      <div className="fw-medium">{selectedSession.places_disponibles}/{selectedSession.capacite_maximale}</div>
                    </div>
                  </div>
                </div>
              </div>

              <hr />

              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">Total à payer</h6>
                  <small className="text-muted">Paiement sécurisé via Stripe</small>
                </div>
                <h4 className="text-success mb-0">{formatCurrency(selectedSession.prix)}</h4>
              </div>
            </Card.Body>
          </Card>

          {/* Student Information */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-light border-0">
              <h5 className="mb-0">Informations de l'étudiant</h5>
            </Card.Header>
            <Card.Body>
              <div className="row">
                <div className="col-md-6">
                  <strong>Nom complet:</strong>
                  <div>{currentUser.prenom} {currentUser.nom}</div>
                </div>
                <div className="col-md-6">
                  <strong>Email:</strong>
                  <div>{currentUser.email}</div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {error && (
            <Alert variant="danger" className="mb-4">
              <h6>Erreur de paiement</h6>
              <p className="mb-0">{error}</p>
            </Alert>
          )}
        </Col>

        <Col lg={4}>
          {/* Payment Actions */}
          <Card className="border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
            <Card.Body>
              <div className="text-center mb-4">
                <FaShieldAlt className="text-success mb-2" size={32} />
                <h6 className="text-success">Paiement 100% sécurisé</h6>
                <small className="text-muted">
                  Vos données sont protégées par le chiffrement SSL et Stripe
                </small>
              </div>

              <div className="d-grid gap-2">
                <Button
                  variant="success"
                  size="lg"
                  onClick={handlePayment}
                  disabled={loading}
                  className="d-flex align-items-center justify-content-center"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Redirection vers Stripe...
                    </>
                  ) : (
                    <>
                      <FaCreditCard className="me-2" />
                      Payer {formatCurrency(selectedSession.prix)}
                    </>
                  )}
                </Button>

                <div className="text-center mt-3">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <FaLock className="text-muted me-2" />
                    <small className="text-muted">Paiement sécurisé par Stripe</small>
                  </div>
                  <div className="d-flex justify-content-center gap-2">
                    <img src="/api/placeholder/40/25" alt="Visa" className="border rounded" />
                    <img src="/api/placeholder/40/25" alt="Mastercard" className="border rounded" />
                    <img src="/api/placeholder/40/25" alt="PayPal" className="border rounded" />
                  </div>
                </div>
              </div>

              <hr />

              <div className="small text-muted">
                <h6 className="small">Conditions de paiement:</h6>
                <ul className="ps-3 mb-0">
                  <li>Le paiement est immédiatement débité</li>
                  <li>Votre inscription sera confirmée après paiement</li>
                  <li>Un reçu vous sera envoyé par email</li>
                  <li>Remboursement possible selon nos conditions générales</li>
                </ul>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PaymentCheckout;