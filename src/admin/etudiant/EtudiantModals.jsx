import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup, Form, Spinner } from 'react-bootstrap';

// --- DETAILS MODAL ---
export const EtudiantDetailsModal = ({ show, handleClose, data, isLoading }) => {
  const etudiantData = data?.etudiant;
  const coursData = data?.cours;

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Détails de l'étudiant</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div className="text-center p-4"><Spinner animation="border" /></div>
        ) : etudiantData ? (
          <>
            <h5>Informations Personnelles</h5>
            <p><strong>Nom:</strong> {etudiantData.nom} {etudiantData.prenom}</p>
            <p><strong>Email:</strong> {etudiantData.email}</p>
            <p><strong>Date d'inscription:</strong> {new Date(etudiantData.date_inscription).toLocaleDateString()}</p>
            <p><strong>Niveau d'études:</strong> {etudiantData.niveau_Etudes}</p>
            <p><strong>Profession:</strong> {etudiantData.profession}</p>
            <hr />
            <h5>Cours Inscrits</h5>
            {coursData && coursData.length > 0 ? (
              <ListGroup>
                {coursData.map(cours => (
                  <ListGroup.Item key={cours.id}>{cours.titre}</ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p>Cet étudiant n'est inscrit à aucun cours.</p>
            )}
          </>
        ) : (
          <p className="text-danger">Impossible de charger les détails de l'étudiant.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Fermer</Button>
      </Modal.Footer>
    </Modal>
  );
};

// --- UPDATE MODAL ---
export const EtudiantUpdateModal = ({ show, handleClose, etudiant, onUpdate, updateMutation }) => {
    const [formData, setFormData] = useState({});
    
    useEffect(() => {
        if (etudiant) {
            setFormData({
                nom: etudiant.nom || '',
                prenom: etudiant.prenom || '',
                email: etudiant.email || '',
                niveau_Etudes: etudiant.niveau_Etudes || '',
                profession: etudiant.profession || '',
                password: '',
                password_confirmation: ''
            });
        }
    }, [etudiant]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (formData.password && formData.password !== formData.password_confirmation) {
          alert("La confirmation du mot de passe ne correspond pas !");
          return;
      }
      
      const dataToUpdate = { ...formData };
      if (!dataToUpdate.password) {
          delete dataToUpdate.password;
      }
      delete dataToUpdate.password_confirmation;

      onUpdate(dataToUpdate);
    };

    if (!etudiant) return null;

    return (
        <Modal show={show} onHide={handleClose} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Modifier l'étudiant</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Nom</Form.Label>
                        <Form.Control type="text" name="nom" value={formData.nom} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Prénom</Form.Label>
                        <Form.Control type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Niveau d'études</Form.Label>
                        <Form.Control type="text" name="niveau_Etudes" value={formData.niveau_Etudes} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Profession</Form.Label>
                        <Form.Control type="text" name="profession" value={formData.profession} onChange={handleChange} />
                    </Form.Group>
                    <hr/>
                    <p className="text-muted"><small>Laissez les champs de mot de passe vides pour ne pas le modifier.</small></p>
                    <Form.Group className="mb-3">
                        <Form.Label>Nouveau Mot de passe</Form.Label>
                        <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} placeholder='Nouveau mot de passe' />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Confirmation du mot de passe</Form.Label>
                        <Form.Control type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} placeholder='Confirmer le mot de passe'/>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} disabled={updateMutation.isLoading}>Annuler</Button>
                    <Button variant="primary" type="submit" disabled={updateMutation.isLoading}>
                        {updateMutation.isLoading ? <><Spinner size="sm" /> Enregistrement...</> : 'Enregistrer'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};
