import React,{useRef} from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Card, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { FaTimesCircle, FaArrowLeft, FaHome, FaRedo } from 'react-icons/fa';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../../Api/apiClient';

const PaymentCancelPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const inscriptionId = searchParams.get('inscription_id');
  const hasCalled = useRef(false);

  const cancelPaymentMutation = useMutation({
    mutationFn: async (inscriptionId) => {
      const response = await apiClient.post(`/payments/cancel/${inscriptionId}`);
      return response.data;
    },
    onError: (error) => {
      console.error('Error cancelling payment:', error);
      // Even if cancellation fails, we show the cancel page
    }
  });

  // Trigger cancellation when component mounts if inscriptionId exists
  React.useEffect(() => {
    if (inscriptionId && !cancelPaymentMutation.isSuccess && !cancelPaymentMutation.isError && !cancelPaymentMutation.isPending) {
      if(inscriptionId&& !cancelPaymentMutation.isSuccess && !cancelPaymentMutation.isError && !cancelPaymentMutation.isPending && !hasCalled.current) {
        cancelPaymentMutation.mutate(inscriptionId);
        hasCalled.current = true;
      }
    }
  }, [inscriptionId]);

  const retryPayment = () => {
    // Navigate back to course selection or payment page
    navigate(`/inscription/${inscriptionId}`); // Adjust path as needed
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          {/* Cancel Header */}
          <Card className="border-0 shadow-sm mb-4 bg-danger text-white">
            <Card.Body className="text-center py-4">
              <FaTimesCircle size={48} className="mb-3" />
              <h2 className="mb-2">Paiement annulé</h2>
              <p className="mb-0 fs-5">
                Votre paiement a été annulé et aucun montant n'a été débité
              </p>
            </Card.Body>
          </Card>

          {/* Loading State */}
          {cancelPaymentMutation.isLoading && (
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 mb-0">Annulation en cours...</p>
              </Card.Body>
            </Card>
          )}

          {/* Information Card */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <h5 className="text-center mb-4">Que s'est-il passé ?</h5>
              
              <Row>
                <Col md={6} className="text-center mb-3">
                  <div className="p-3 bg-light rounded">
                    <h6 className="text-primary">Aucun débit</h6>
                    <p className="small text-muted mb-0">
                      Votre carte bancaire n'a pas été débitée
                    </p>
                  </div>
                </Col>
                <Col md={6} className="text-center mb-3">
                  <div className="p-3 bg-light rounded">
                    <h6 className="text-primary">Inscription annulée</h6>
                    <p className="small text-muted mb-0">
                      Votre réservation de place a été libérée
                    </p>
                  </div>
                </Col>
              </Row>

              <Alert variant="info" className="mt-3">
                <h6>Vous pouvez toujours vous inscrire !</h6>
                <p className="mb-0">
                  La place que vous aviez réservée est maintenant disponible pour d'autres étudiants. 
                  Vous pouvez recommencer le processus d'inscription à tout moment.
                </p>
              </Alert>
            </Card.Body>
          </Card>

          {/* Reasons for Cancellation */}
          <Card className="border-0 shadow-sm mb-4 bg-light">
            <Card.Body>
              <h6 className="text-primary mb-3">Raisons courantes d'annulation :</h6>
              <ul className="small mb-0">
                <li>Vous avez fermé la fenêtre de paiement</li>
                <li>Le temps de paiement a expiré (30 minutes)</li>
                <li>Vous avez cliqué sur "Annuler" pendant le processus</li>
                <li>Un problème technique est survenu</li>
              </ul>
            </Card.Body>
          </Card>

          {/* Action Buttons */}
          <div className="d-grid gap-2">
            <Button 
              variant="success" 
              size="lg"
              onClick={()=>navigate(-1)}
              className="d-flex align-items-center justify-content-center"
            >
              <FaRedo className="me-2" />
              Réessayer le paiement
            </Button>
            
            <div className="d-flex gap-2">
              <Button 
                variant="outline-primary" 
                onClick={() => navigate(-1)}
                className="flex-fill d-flex align-items-center justify-content-center"
              >
                <FaArrowLeft className="me-2" />
                Retour
              </Button>
              
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/')}
                className="flex-fill d-flex align-items-center justify-content-center"
              >
                <FaHome className="me-2" />
                Accueil
              </Button>
            </div>
          </div>

          {/* Help Section */}
          <Card className="border-0 shadow-sm mt-4">
            <Card.Body className="text-center">
              <h6 className="text-primary">Besoin d'aide ?</h6>
              <p className="small text-muted mb-3">
                Si vous rencontrez des difficultés pour finaliser votre paiement, 
                notre équipe support est là pour vous aider.
              </p>
              <div className="d-flex gap-2 justify-content-center">
                <Button to='/contact' as={Link} className='button ' variant="outline-info" size="sm">
                  Contacter le support
                </Button>
                <Button to='/contact' as={Link} className='button' variant="outline-info" size="sm">
                  FAQ Paiements
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;