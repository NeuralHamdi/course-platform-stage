import React, { useState } from 'react';
import { Card, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
// Make sure to use icons for the new design
import { FaCreditCard, FaLock, FaShieldAlt, FaArrowLeft, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import apiClient from '../Api/apiClient';



import '../style/PaymentCheckout.css';


const PaymentCheckout = ({ selectedSession, currentUser, onBack, onPaymentStart }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- LOGIC REMAINS UNCHANGED ---
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(amount);
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
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

  // --- VIEW LOGIC IS UPDATED BELOW ---
  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex align-items-center mb-4">
        <Button variant="light" onClick={onBack} className="me-3 back-button">
          <FaArrowLeft className="me-2" />
          Retour
        </Button>
        <h2 className="mb-0 fw-bold">
          <FaCreditCard className="me-3 text-primary" />
          Finaliser votre inscription
        </h2>
      </div>

      <Row className="g-4">
        {/* Left Column: Order Details */}
        <Col lg={7}>
          {/* Order Summary Card */}
          <Card className="checkout-card mb-4">
            <Card.Header>
              <h5 className="mb-0 fw-bold">Récapitulatif de la commande</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <img
                    src={selectedSession.cours?.url_images}
                    alt={selectedSession.cours?.titre}
                    className="summary-image"
                  />
                </Col>
                <Col md={8} className="d-flex flex-column">
                  <h5 className="fw-bold text-primary">{selectedSession.cours?.titre}</h5>
                  <h6 className="mb-2">{selectedSession.titre}</h6>
                  <p className="text-muted small mb-3">{selectedSession.cours?.description}</p>
                  
                  <Row className="g-3 mt-auto">
                    <Col sm={6}>
                      <small className="text-muted d-block">Début de la session</small>
                      <div className="fw-medium">{formatDate(selectedSession.date_debut)}</div>
                    </Col>
                     {selectedSession.date_fin && (
                      <Col sm={6}>
                        <small className="text-muted d-block">Fin de la session</small>
                        <div className="fw-medium">{formatDate(selectedSession.date_fin)}</div>
                      </Col>
                    )}
                    <Col sm={6}>
                      <small className="text-muted d-block">Places restantes</small>
                      <div className="fw-medium">{selectedSession.places_disponibles} / {selectedSession.capacite_maximale}</div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Student Information Card */}
          <Card className="checkout-card mb-4">
            <Card.Header>
              <h5 className="mb-0 fw-bold">Vos Informations</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6} className="mb-2 mb-md-0">
                  <strong className="d-block text-muted">Nom complet</strong>
                  <div>{currentUser.prenom} {currentUser.nom}</div>
                </Col>
                <Col md={6}>
                  <strong className="d-block text-muted">Adresse e-mail</strong>
                  <div>{currentUser.email}</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {error && (
            <Alert variant="danger" className="d-flex align-items-center">
              <FaInfoCircle size="1.5em" className="me-3" />
              <div>
                <h6 className="alert-heading">Erreur de paiement</h6>
                {error}
              </div>
            </Alert>
          )}
        </Col>

        {/* Right Column: Payment Actions */}
        <Col lg={5}>
          <Card className="payment-sidebar shadow-sm">
            <Card.Body className="p-4">
              <div className="total-display d-flex justify-content-between align-items-center">
                  <span className="total-label">Total à Payer</span>
                  <span className="total-amount">{formatCurrency(selectedSession.prix)}</span>
              </div>
            
              <div className="d-grid gap-2 mb-4">
                <Button
                  variant="success"
                  size="lg"
                  onClick={handlePayment}
                  disabled={loading}
                  className="d-flex align-items-center justify-content-center pay-button"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Redirection en cours...
                    </>
                  ) : (
                    <>
                      <FaLock className="me-2" />
                      Payer en toute sécurité
                    </>
                  )}
                </Button>
              </div>

              <div className="text-center text-muted small mb-4">
                <FaShieldAlt className="me-1 text-success" /> Paiement 100% sécurisé via Stripe.
              </div>

              <hr />

              <div>
                <h6 className="fw-bold mb-3">Votre inscription inclut :</h6>
                <ul className="conditions-list">
                  <li><FaCheckCircle className="icon" /> Paiement unique et sécurisé.</li>
                  <li><FaCheckCircle className="icon" /> Confirmation immédiate de votre place.</li>
                  <li><FaCheckCircle className="icon" /> Reçu de paiement envoyé par email.</li>
                  <li><FaCheckCircle className="icon" /> Accès complet aux ressources du cours.</li>
                </ul>
              </div>

              <div className="text-center mt-4">
                <small className="text-muted d-block mb-2">Nous acceptons :</small>
              
                <div className="d-flex justify-content-center gap-3 payment-methods">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" />
                   <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" />
                   <img src="https://upload.wikimedia.org/wikipedia/commons/3/39/PayPal_logo.svg" alt="PayPal" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PaymentCheckout;