import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../Api/apiClient';

// API functions
const fetchCourses = async () => {
  const res = await apiClient.get('/courses/all');
  return res.data || [];
};

const fetchSessions = async (courseId) => {
  const res = await apiClient.get(`/courses/${courseId}/sessions`);
  return res.data || [];
};

const addInscription = async (data) => {
  const res = await apiClient.post(`/etudiants/${data.etudiantId}/inscriptions`, {
    session_id: data.sessionId,
    montant_paye: data.montantPaye,
    methode_paiement: data.methodePaiement,
    statut: data.statutInscription
  });
  return res.data;
};

const AddCourseToStudentModal = ({ show, handleClose, etudiantId, refetchEtudiantDetails }) => {
  const queryClient = useQueryClient();

  // Form state
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [montantPaye, setMontantPaye] = useState('');
  const [methodePaiement, setMethodePaiement] = useState('cash');
  const [statutInscription, setStatutInscription] = useState('en_attente');
  const [error, setError] = useState('');

  // Reset form function
  const resetForm = () => {
    setSelectedCourse('');
    setSelectedSession('');
    setMontantPaye('');
    setMethodePaiement('cash');
    setStatutInscription('en_attente');
    setError('');
  };

  // Close modal handler
  const closeModal = () => {
    resetForm();
    handleClose();
  };

  // Fetch courses query
  const { 
    data: courses = [], 
    isLoading: loadingCourses, 
    isError: errorCourses 
  } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
    enabled: show,
  });

  // Fetch sessions query
  const { 
    data: sessions = [], 
    isLoading: loadingSessions, 
    isError: errorSessions 
  } = useQuery({
    queryKey: ['sessions', selectedCourse],
    queryFn: () => fetchSessions(selectedCourse),
    enabled: !!selectedCourse,
  });

  // Add inscription mutation
  const mutation = useMutation({
    mutationFn: addInscription,
    onSuccess: () => {
      alert('Inscription ajoutée avec succès !');
      closeModal();
      queryClient.invalidateQueries(['etudiants']);
      if (refetchEtudiantDetails) {
        refetchEtudiantDetails();
      }
    },
    onError: (error) => {
      console.error('Erreur inscription:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Erreur lors de l'inscription.";
      setError(errorMessage);
    },
  });

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!selectedSession) {
      setError('Veuillez sélectionner une session.');
      return;
    }
    
    if (statutInscription === 'confirmee' && (!montantPaye || parseFloat(montantPaye) <= 0)) {
      setError('Veuillez saisir un montant payé valide pour confirmer l\'inscription.');
      return;
    }

    // Submit data
    mutation.mutate({
      etudiantId,
      sessionId: selectedSession,
      montantPaye: parseFloat(montantPaye) || 0,
      methodePaiement,
      statutInscription
    });
  };

  return (
    <Modal show={show} onHide={closeModal} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Ajouter un cours à l'étudiant</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          {/* Course Selection */}
          <Form.Group className="mb-3">
            <Form.Label>Cours <span className="text-danger">*</span></Form.Label>
            {loadingCourses ? (
              <div className="text-center py-2">
                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                Chargement des cours...
              </div>
            ) : errorCourses ? (
              <Alert variant="danger">Erreur lors du chargement des cours.</Alert>
            ) : (
              <Form.Select
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  setSelectedSession(''); // Reset session when course changes
                }}
                required
              >
                <option value="">-- Sélectionner un cours --</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.titre || course.name || `Cours ${course.id}`}
                  </option>
                ))}
              </Form.Select>
            )}
          </Form.Group>

          {/* Session Selection */}
          {selectedCourse && (
            <Form.Group className="mb-3">
              <Form.Label>Session <span className="text-danger">*</span></Form.Label>
              {loadingSessions ? (
                <div className="text-center py-2">
                  <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                  Chargement des sessions...
                </div>
              ) : errorSessions ? (
                <Alert variant="danger">Erreur lors du chargement des sessions.</Alert>
              ) : (
                <Form.Select
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value)}
                  required
                >
                  <option value="">-- Sélectionner une session --</option>
                  {sessions.map(session => (
                    <option key={session.id} value={session.id}>
                      {session.titre || session.name || `Session ${session.id}`}
                      {session.date_debut && ` - ${new Date(session.date_debut).toLocaleDateString('fr-FR')}`}
                      {session.prix && ` (${session.prix} DH)`}
                    </option>
                  ))}
                </Form.Select>
              )}
            </Form.Group>
          )}

          {/* Payment and Status Section */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Statut de l'inscription <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  value={statutInscription}
                  onChange={(e) => setStatutInscription(e.target.value)}
                  required
                >
                  <option value="en_attente">En attente</option>
                  <option value="confirmee">Confirmée</option>
                </Form.Select>
                <Form.Text className="text-muted">
                  Sélectionnez "Confirmée" si le paiement a été effectué
                </Form.Text>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Méthode de paiement</Form.Label>
                <Form.Select
                  value={methodePaiement}
                  onChange={(e) => setMethodePaiement(e.target.value)}
                >
                  <option value="cash">Espèces</option>
                  <option value="card">Carte bancaire</option>
                  <option value="bank_transfer">Virement bancaire</option>
                  <option value="check">Chèque</option>
                  <option value="mobile_money">Mobile Money</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Montant payé (DH)</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              min="0"
              value={montantPaye}
              onChange={(e) => setMontantPaye(e.target.value)}
              placeholder="0.00"
            />
            <Form.Text className="text-muted">
              Laissez vide ou 0 si aucun paiement n'a été effectué
            </Form.Text>
          </Form.Group>

          {/* Information Alert */}
          <Alert variant="info" className="mb-3">
            <Alert.Heading className="h6">Information sur les statuts :</Alert.Heading>
            <ul className="mb-0 mt-2 small">
              <li><strong>En attente :</strong> L'inscription est créée mais en attente de validation/paiement</li>
              <li><strong>Confirmée :</strong> L'inscription est validée et l'étudiant peut accéder au cours</li>
            </ul>
          </Alert>
        </Form>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal} disabled={mutation.isLoading}>
          Annuler
        </Button>
        <Button 
          variant="primary" 
          type="submit" 
          disabled={mutation.isLoading || !selectedSession}
          onClick={handleSubmit}
        >
          {mutation.isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Ajout en cours...
            </>
          ) : (
            "Ajouter l'inscription"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddCourseToStudentModal;