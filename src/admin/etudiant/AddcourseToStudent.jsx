import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import apiClient from '../../Api/apiClient';

const fetchCourses = async () => {

  const res = await apiClient.get('/courses/all');
  console.log(res.data);
  return res.data || [];
};

const fetchSessions = async (courseId) => {
  const res = await apiClient.get(`/courses/${courseId}/sessions`);
  return res.data.sessions || [];
};

const addInscription = async ({ etudiantId, sessionId }) => {
  const res = await apiClient.post(`/etudiants/${etudiantId}/inscriptions`, {
    session_id: sessionId,
  });
  return res.data;
};

const AddCourseToStudentModal = ({ show, handleClose, etudiantId, refetchEtudiantDetails }) => {
  const queryClient = useQueryClient();

  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [error, setError] = useState('');

  const { data: courses, isLoading: loadingCourses, isError: errorCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
    enabled: show, // charge seulement quand le modal est ouvert
  });

  const { data: sessions, isLoading: loadingSessions, isError: errorSessions } = useQuery({
    queryKey: ['sessions', selectedCourse],
    queryFn: () => fetchSessions(selectedCourse),
    enabled: !!selectedCourse, // charge seulement si un cours est sélectionné
  });
  

  const mutation = useMutation({
    mutationFn: ({ etudiantId, sessionId }) => addInscription({ etudiantId, sessionId }),
    onSuccess: () => {
      alert('Inscription ajoutée avec succès !');
      handleClose();
      queryClient.invalidateQueries(['etudiants']); // rafraîchir la liste si besoin
      if (refetchEtudiantDetails) refetchEtudiantDetails();
      setSelectedCourse('');
      setSelectedSession('');
    },
    onError: (error) => {
      console.error(error);
      setError(error.response?.data?.message || "Erreur lors de l'inscription.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSession) {
      setError('Veuillez sélectionner une session.');
      return;
    }
    mutation.mutate({ etudiantId, sessionId: selectedSession });
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter un cours à l'étudiant</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Cours</Form.Label>
            {loadingCourses ? (
              <div>Chargement des cours...</div>
            ) : errorCourses ? (
              <Alert variant="danger">Erreur lors du chargement des cours.</Alert>
            ) : (
              <Form.Select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                required
              >
                <option value="">-- Sélectionner un cours --</option>
                {courses?.map(course => (
                    <>
                      console.log(course.id);
                  <option key={course.id} value={course.id}>{course.titre}</option>
                    </>
                  
                ))}
              </Form.Select>
            )}
          </Form.Group>

          {selectedCourse && (
            <Form.Group className="mb-3">
              <Form.Label>Session</Form.Label>
              {loadingSessions ? (
                <div>Chargement des sessions...</div>
              ) : errorSessions ? (
                <Alert variant="danger">Erreur lors du chargement des sessions.</Alert>
              ) : (
                <Form.Select
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value)}
                  required
                >
                  <option value="">-- Sélectionner une session --</option>
                  { sessions?.map(session => (
                    <option key={session.id} value={session.id}>{session.titre}</option>
                  ))}
                </Form.Select>
              )}
            </Form.Group>
          )}

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Annuler</Button>
            <Button variant="primary" type="submit" disabled={mutation.isLoading}>
              {mutation.isLoading ? "Ajout en cours..." : "Ajouter"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddCourseToStudentModal;
