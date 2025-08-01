import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Spinner, Alert } from 'react-bootstrap';

const SessionAddModal = ({ show, handleClose, onAdd, courses, isLoadingCourses, addMutation }) => {
  // Initial state for the form, easy to reset
  const initialState = {
    titre: '',
    prix: '',
    date_debut: '',
    date_fin: '',
    date_fin_inscription: '',
    capacite_maximale: '',
    statut: 'active', // Default status
    cours_id: '',
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState(null);

  // Reset form when the modal is closed or opened
  useEffect(() => {
    if (!show) {
      setFormData(initialState);
      setErrors(null);
    }
  }, [show]);

  // Handle changes in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Clear previous errors
    setErrors(null);
    
    // Basic frontend validation
    if (!formData.cours_id) {
        setErrors({ cours_id: ['Le champ cours est requis.'] });
        return;
    }

    onAdd(formData, {
        onError: (error) => {
            // Extract validation errors from the API response
            try {
                const errorJson = JSON.parse(error.message.substring(error.message.indexOf('{')));
                setErrors(errorJson);
            } catch (e) {
                // If parsing fails, show a generic error
                setErrors({ general: [error.message] });
            }
        }
    });
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Ajouter une Nouvelle Session</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {/* Display general errors from the mutation */}
          {errors && errors.general && (
            <Alert variant="danger">{errors.general.join(', ')}</Alert>
          )}

          <Row>
            {/* Titre */}
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formTitre">
                <Form.Label>Titre de la session</Form.Label>
                <Form.Control
                  type="text"
                  name="titre"
                  value={formData.titre}
                  onChange={handleChange}
                  isInvalid={!!errors?.titre}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors?.titre?.[0]}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Prix */}
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formPrix">
                <Form.Label>Prix (en €)</Form.Label>
                <Form.Control
                  type="number"
                  name="prix"
                  value={formData.prix}
                  onChange={handleChange}
                  isInvalid={!!errors?.prix}
                  min="0"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors?.prix?.[0]}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* Date de début */}
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formDateDebut">
                <Form.Label>Date de début</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="date_debut"
                  value={formData.date_debut}
                  onChange={handleChange}
                  isInvalid={!!errors?.date_debut}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors?.date_debut?.[0]}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Date de fin */}
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formDateFin">
                <Form.Label>Date de fin</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="date_fin"
                  value={formData.date_fin}
                  onChange={handleChange}
                  isInvalid={!!errors?.date_fin}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors?.date_fin?.[0]}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* Date fin inscription */}
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formDateFinInscription">
                <Form.Label>Date de fin d'inscription (Optionnel)</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="date_fin_inscription"
                  value={formData.date_fin_inscription}
                  onChange={handleChange}
                  isInvalid={!!errors?.date_fin_inscription}
                />
                 <Form.Control.Feedback type="invalid">
                  {errors?.date_fin_inscription?.[0]}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Capacité maximale */}
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formCapaciteMaximale">
                <Form.Label>Capacité maximale</Form.Label>
                <Form.Control
                  type="number"
                  name="capacite_maximale"
                  value={formData.capacite_maximale}
                  onChange={handleChange}
                  isInvalid={!!errors?.capacite_maximale}
                  min="1"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors?.capacite_maximale?.[0]}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          
          <Row>
            {/* Cours */}
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formCoursId">
                <Form.Label>Cours associé</Form.Label>
                {isLoadingCourses ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <Form.Select
                    name="cours_id"
                    value={formData.cours_id}
                    onChange={handleChange}
                    isInvalid={!!errors?.cours_id}
                    required
                  >
                    <option value="">Sélectionnez un cours...</option>
                    {courses?.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.titre}
                      </option>
                    ))}
                  </Form.Select>
                )}
                <Form.Control.Feedback type="invalid">
                  {errors?.cours_id?.[0]}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Statut */}
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formStatut">
                <Form.Label>Statut</Form.Label>
                <Form.Select
                  name="statut"
                  value={formData.statut}
                  onChange={handleChange}
                  isInvalid={!!errors?.statut}
                  required
                >
                  <option value="active">Active</option>
                  <option value="en_cours">En cours</option>
                  <option value="terminee">Terminée</option>
                </Form.Select>
                 <Form.Control.Feedback type="invalid">
                  {errors?.statut?.[0]}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={addMutation.isLoading}>
            Annuler
          </Button>
          <Button variant="primary" type="submit" disabled={addMutation.isLoading}>
            {addMutation.isLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                {' '}Ajout en cours...
              </>
            ) : (
              'Ajouter la Session'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default SessionAddModal;
