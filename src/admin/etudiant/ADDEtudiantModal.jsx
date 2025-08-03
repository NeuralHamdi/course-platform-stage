import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FaCheckCircle } from 'react-icons/fa';
import apiClient from '../../Api/apiClient';

const AddEtudiantModal = ({ show, handleClose }) => {
  const queryClient = useQueryClient();

  // Champs du formulaire
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profession, setProfession] = useState('');
  const [niveau_Etudes, setNiveauEtudes] = useState('');

  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');

  // Mutation React Query
  const addMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post('/register', {
        nom, prenom, email, password, profession, niveau_Etudes
      });
      return response.data;
    },
    onSuccess: () => {
      setSuccess("Étudiant ajouté avec succès !");
      setErrors([]);
      queryClient.invalidateQueries(['etudiants']); // Refresh la liste
      // Reset le formulaire après succès
      setNom('');
      setPrenom('');
      setEmail('');
      setPassword('');
      setProfession('');
      setNiveauEtudes('');
      // Ferme le modal après 2s
      setTimeout(() => {
        setSuccess('');
        handleClose();
      }, 2000);
    },
    onError: (error) => {
      setSuccess('');
      if (error.response?.data?.errors) {
        const backendErrors = Object.values(error.response.data.errors).flat();
        setErrors(backendErrors);
      } else {
        setErrors([error.response?.data?.message || "Une erreur est survenue."]);
      }
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccess('');
    addMutation.mutate();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter un étudiant</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {success && (
          <Alert variant="success" className="d-flex align-items-center gap-2">
            <FaCheckCircle /> <span>{success}</span>
          </Alert>
        )}

        {errors.length > 0 && (
          <Alert variant="danger">
            <ul className="mb-0 ps-3">
              {errors.map((err, idx) => <li key={idx}>{err}</li>)}
            </ul>
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nom</Form.Label>
            <Form.Control type="text" value={nom} onChange={(e) => setNom(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Prénom</Form.Label>
            <Form.Control type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Profession</Form.Label>
            <Form.Select value={profession} onChange={(e) => setProfession(e.target.value)} required>
              <option value="">-- Choisir --</option>
              <option value="etudiant">Étudiant</option>
              <option value="developpeur">Développeur</option>
              <option value="designer">Designer</option>
              <option value="chef_de_projet">Chef de projet</option>
              <option value="autre">Autre</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Niveau d'études</Form.Label>
            <Form.Select value={niveau_Etudes} onChange={(e) => setNiveauEtudes(e.target.value)} required>
              <option value="">-- Choisir --</option>
              <option value="bac">Baccalauréat</option>
              <option value="bac+3">Licence (Bac+3)</option>
              <option value="bac+5">Master (Bac+5)</option>
              <option value="bac+8">Doctorat (Bac+8)</option>
              <option value="autre">Autre</option>
            </Form.Select>
          </Form.Group>

          <Button type="submit" variant="primary" disabled={addMutation.isLoading} className="w-100">
            {addMutation.isLoading ? <Spinner size="sm" /> : "Ajouter"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddEtudiantModal;
