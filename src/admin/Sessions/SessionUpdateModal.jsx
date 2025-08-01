import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const SessionUpdateModal = ({ show, handleClose, session, onUpdate, updateMutation }) => {
  const [formData, setFormData] = useState({
    titre: '',
    prix: '',
    date_debut: '',
    date_fin: '',
    date_fin_inscription: '',
    capacite_maximale: '',
    statut: 'active'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (session) {
      setFormData({
        titre: session.titre || '',
        prix: session.prix || '',
        date_debut: session.date_debut ? new Date(session.date_debut).toISOString().slice(0, 16) : '',
        date_fin: session.date_fin ? new Date(session.date_fin).toISOString().slice(0, 16) : '',
        date_fin_inscription: session.date_fin_inscription ? new Date(session.date_fin_inscription).toISOString().slice(0, 16) : '',
        capacite_maximale: session.capacite_maximale || '',
        statut: session.statut || 'active'
      });
      setErrors({});
    }
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titre.trim()) {
      newErrors.titre = 'Le titre est requis';
    }

    if (!formData.prix || parseFloat(formData.prix) < 0) {
      newErrors.prix = 'Le prix doit être un nombre positif';
    }

    if (!formData.date_debut) {
      newErrors.date_debut = 'La date de début est requise';
    }

    if (!formData.date_fin) {
      newErrors.date_fin = 'La date de fin est requise';
    }

    if (formData.date_debut && formData.date_fin && new Date(formData.date_debut) >= new Date(formData.date_fin)) {
      newErrors.date_fin = 'La date de fin doit être après la date de début';
    }

    if (formData.date_fin_inscription && formData.date_debut && new Date(formData.date_fin_inscription) >= new Date(formData.date_debut)) {
      newErrors.date_fin_inscription = 'La date de fin d\'inscription doit être avant la date de début';
    }

    if (!formData.capacite_maximale || parseInt(formData.capacite_maximale) < 1) {
      newErrors.capacite_maximale = 'La capacité doit être au moins de 1';
    }

    // Check if new capacity is less than occupied places
    if (session && formData.capacite_maximale) {
      const placesOccupees = session.capacite_maximale - session.places_disponibles;
      if (parseInt(formData.capacite_maximale) < placesOccupees) {
        newErrors.capacite_maximale = `La capacité ne peut pas être inférieure aux places déjà occupées (${placesOccupees})`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Convert strings to appropriate types
    const submitData = {
      ...formData,
      prix: parseFloat(formData.prix),
      capacite_maximale: parseInt(formData.capacite_maximale)
    };

    onUpdate(submitData);
  };

  const handleCloseModal = () => {
    setErrors({});
    handleClose();
  };

  if (!session) return null;

  return (
    <Modal show={show} onHide={handleCloseModal} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Modifier la session</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {updateMutation?.error && (
            <Alert variant="danger">
              {updateMutation.error.response?.data?.message || 'Une erreur est survenue lors de la mise à jour'}
            </Alert>
          )}

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Titre *</Form.Label>
                <Form.Control 
                  type="text" 
                  name="titre" 
                  value={formData.titre} 
                  onChange={handleChange}
                  isInvalid={!!errors.titre}
                  placeholder="Titre de la session"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.titre}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Prix (€) *</Form.Label>
                <Form.Control 
                  type="number" 
                  step="0.01"
                  min="0"
                  name="prix" 
                  value={formData.prix} 
                  onChange={handleChange}
                  isInvalid={!!errors.prix}
                  placeholder="0.00"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.prix}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Date de début *</Form.Label>
                <Form.Control 
                  type="datetime-local"
                  name="date_debut" 
                  value={formData.date_debut} 
                  onChange={handleChange}
                  isInvalid={!!errors.date_debut}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.date_debut}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Date de fin *</Form.Label>
                <Form.Control 
                  type="datetime-local"
                  name="date_fin" 
                  value={formData.date_fin} 
                  onChange={handleChange}
                  isInvalid={!!errors.date_fin}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.date_fin}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Date fin inscription</Form.Label>
                <Form.Control 
                  type="datetime-local"
                  name="date_fin_inscription" 
                  value={formData.date_fin_inscription} 
                  onChange={handleChange}
                  isInvalid={!!errors.date_fin_inscription}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.date_fin_inscription}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Optionnel - Laissez vide si pas de limite d'inscription
                </Form.Text>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Capacité maximale *</Form.Label>
                <Form.Control 
                  type="number"
                  name="capacite_maximale" 
                  value={formData.capacite_maximale} 
                  onChange={handleChange}
                  min="1"
                  isInvalid={!!errors.capacite_maximale}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.capacite_maximale}
                </Form.Control.Feedback>
                {session && (
                  <Form.Text className="text-muted">
                    Places occupées actuellement: {session.capacite_maximale - session.places_disponibles}
                  </Form.Text>
                )}
              </Form.Group>
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Statut *</Form.Label>
            <Form.Select 
              name="statut" 
              value={formData.statut} 
              onChange={handleChange}
              isInvalid={!!errors.statut}
            >
              <option value="active">Active</option>
              <option value="en_cours">En cours</option>
              <option value="terminee">Terminée</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.statut}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} disabled={updateMutation?.isLoading}>
            Annuler
          </Button>
          <Button variant="primary" type="submit" disabled={updateMutation?.isLoading}>
            {updateMutation?.isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Enregistrement...
              </>
            ) : (
              'Enregistrer les modifications'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default SessionUpdateModal;