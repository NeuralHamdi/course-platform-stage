import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Spinner } from 'react-bootstrap';

const CourseUpdateModal = ({ show, handleClose, course, onUpdate, updateMutation }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // When the course prop changes, update the form data
    if (course) {
      setFormData({
        titre: course.titre || '',
        description: course.description || '',
        about: course.about || '',
        duree: course.duree || '',
        duree_unite: course.duree_unite || 'weeks',
        niveau: course.niveau || 'Beginner',
       
        url_image: course.url_image || '',
        module_id: course.module_id || '',
        objectifs: course.objectifs ? course.objectifs.join('\n') : '', // Join objectives by newline for textarea
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
        ...formData,
        // Split objectives back into an array
        objectifs: formData.objectifs.split('\n').filter(line => line.trim() !== '')
    };
    onUpdate(dataToSubmit);
  };

  if (!course) return null;

  return (
    <Modal show={show} onHide={handleClose} centered size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Modifier le Cours: {course.titre}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Titre</Form.Label>
                <Form.Control type="text" name="titre" value={formData.titre} onChange={handleChange} required />
              </Form.Group>
            </Col>
          
          </Row>
          
          <Form.Group className="mb-3">
            <Form.Label>Description Courte</Form.Label>
            <Form.Control as="textarea" rows={2} name="description" value={formData.description} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>À propos (Description complète)</Form.Label>
            <Form.Control as="textarea" rows={4} name="about" value={formData.about} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Objectifs (un par ligne)</Form.Label>
            <Form.Control as="textarea" rows={4} name="objectifs" value={formData.objectifs} onChange={handleChange} />
          </Form.Group>

          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Durée</Form.Label>
                <Form.Control type="number" name="duree" value={formData.duree} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Unité</Form.Label>
                <Form.Select name="duree_unite" value={formData.duree_unite} onChange={handleChange}>
                  <option value="hours">Heures</option>
                  <option value="days">Jours</option>
                  <option value="weeks">Semaines</option>
                  <option value="months">Mois</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Niveau</Form.Label>
                <Form.Select name="niveau" value={formData.niveau} onChange={handleChange}>
                  <option value="Beginner">Débutant</option>
                  <option value="Intermediate">Intermédiaire</option>
                  <option value="Advanced">Avancé</option>
                </Form.Select>
              </Form.Group>
            </Col>
             <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Module ID</Form.Label>
                <Form.Control type="number" name="module_id" value={formData.module_id} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>URL de l'Image</Form.Label>
            <Form.Control type="url" name="url_image" value={formData.url_image} onChange={handleChange} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={updateMutation.isLoading}>Annuler</Button>
          <Button variant="primary" type="submit" disabled={updateMutation.isLoading}>
            {updateMutation.isLoading ? (
                <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    {' '}Enregistrement...
                </>
            ) : 'Enregistrer les modifications'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CourseUpdateModal;
