import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import apiClient from '../../Api/apiClient';

const ModalAddCourse = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    about: '',
    duree: '',
    duree_unite: 'weeks',
    niveau: 'Beginner',
  
    url_image: '',
    objectifs: [],
    module_id: '',
  });

  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();

  // Fetch des modules
  const { data: modules } = useQuery({
    queryKey: ['modules'],
    queryFn: async () => {
      const res = await apiClient.get('/modules/all')
       
      return res.data;
    }
  });

  const mutation = useMutation({

    mutationFn: async (data) => {
      const response = await apiClient.post('/courses/add', data
     );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['courses-paginated']);
      handleClose();
    },
    onError: (error) => {
      alert('Erreur: ' + error.response?.data?.message || error.message);
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleObjectifsChange = (e) => {
    setFormData(prev => ({
      ...prev,
      objectifs: e.target.value.split(',').map(item => item.trim())
    }));
  };

const handleSubmit = (e) => {
  e.preventDefault();

  const preparedData = {
    ...formData,
    duree: formData.duree ? parseInt(formData.duree, 10) : null,
   
    module_id: parseInt(formData.module_id, 10),
  };

  console.log('🛠 Données finales envoyées :', preparedData);
  mutation.mutate(preparedData);
};


  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Créer un nouveau cours</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Titre</Form.Label>
            <Form.Control name="titre" value={formData.titre} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>À propos</Form.Label>
            <Form.Control as="textarea" name="about" value={formData.about} onChange={handleChange} required />
          </Form.Group>

          <div className="row">
            <div className="col-md-4">
              <Form.Group className="mb-3">
                <Form.Label>Durée</Form.Label>
                <Form.Control type="number" name="duree" value={formData.duree} onChange={handleChange} required/>
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group className="mb-3">
                <Form.Label>Unité de durée</Form.Label>
                <Form.Select name="duree_unite" value={formData.duree_unite} onChange={handleChange} required>
                  <option value="hours">Heures</option>
                  <option value="days">Jours</option>
                  <option value="weeks">Semaines</option>
                  <option value="months">Mois</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group className="mb-3">
                <Form.Label>Niveau</Form.Label>
                <Form.Select name="niveau" value={formData.niveau} onChange={handleChange} required>
                  <option value="Beginner">Débutant</option>
                  <option value="Intermediate">Intermédiaire</option>
                  <option value="Advanced">Avancé</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>

          

          <Form.Group className="mb-3">
            <Form.Label>Image (URL)</Form.Label>
            <Form.Control name="url_image" value={formData.url_image} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Objectifs (séparés par des virgules)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ex: Apprendre les bases, Comprendre la logique"
              onChange={handleObjectifsChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Module associé</Form.Label>
            <Form.Select name="module_id" value={formData.module_id} onChange={handleChange} required>
              <option value="">-- Choisir un module --</option>
              {modules?.map((mod) => (
                <option key={mod.id} value={mod.id}>
                  {mod.titre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Annuler</Button>
          <Button variant="primary" type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? "En cours..." : "Créer"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalAddCourse;
