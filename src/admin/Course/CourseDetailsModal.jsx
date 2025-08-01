import React from 'react';
import { Modal, Button, Spinner, ListGroup, Badge } from 'react-bootstrap';
import { FaFileExcel } from 'react-icons/fa';

const CourseDetailsModal = ({ show, handleClose, data, isLoading, onDownloadRoster }) => {
  const courseData = data;

  // Helper to get a Bootstrap badge class and text based on the course level
  const getLevelBadge = (level) => {
    switch (level) {
      case 'Beginner': return { class: 'bg-success', text: 'Débutant' };
      case 'Intermediate': return { class: 'bg-warning', text: 'Intermédiaire' };
      case 'Advanced': return { class: 'bg-danger', text: 'Avancé' };
      default: return { class: 'bg-secondary', text: level };
    }
  };
  
  // Helper to get a Bootstrap badge class and text for the session status
  const getSessionStatusBadge = (status) => {
    switch (status) {
      case 'active': return { class: 'bg-success', text: 'Active' };
      case 'a_venir': return { class: 'bg-info', text: 'À venir' };
      case 'terminee': return { class: 'bg-secondary', text: 'Terminée' };
      default: return { class: 'bg-dark', text: status };
    }
  };

  // Helper to format date strings for better display
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Helper to format currency
  const formatCurrency = (amount) => new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(parseFloat(amount));

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Détails du cours</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div className="text-center p-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Chargement...</span>
            </Spinner>
            <p className="mt-2">Chargement des détails...</p>
          </div>
        ) : courseData ? (
          <>
            {/* --- Course Details Section --- */}
            <div className="row">
              <div className="col-md-4">
                <img
                  src={courseData.url_image}
                  alt={courseData.titre}
                  className="img-fluid rounded shadow-sm"
                />
              </div>
              <div className="col-md-8">
                <h5>{courseData.titre}</h5>
                <p><strong>Description:</strong> {courseData.description}</p>
                <p><strong>Niveau:</strong> <Badge bg={getLevelBadge(courseData.niveau).class}>
                    {getLevelBadge(courseData.niveau).text}
                  </Badge>
                </p>
                <p><strong>Durée:</strong> {courseData.duree} {courseData.duree_unite}</p>
                <p><strong>Prix de référence:</strong> {formatCurrency(courseData.prix_reference)}</p>
                <p><strong>Module:</strong> {courseData.module_id}</p>
                <p><strong>Créé le:</strong> {formatDate(courseData.created_at)}</p>
              </div>
            </div>
            <hr />
            <h6>À propos du cours</h6>
            <p>{courseData.about}</p>
            <h6>Objectifs d'apprentissage</h6>
            {courseData.objectifs?.length > 0 ? (
              <ul>
                {courseData.objectifs.map((objectif, index) => <li key={index}>{objectif}</li>)}
              </ul>
            ) : (
              <p className="text-muted">Aucun objectif spécifié.</p>
            )}

            {/* --- Sessions Section (NEW) --- */}
            <hr />
            <h6>Sessions programmées</h6>
            {courseData.sessions && courseData.sessions.length > 0 ? (
              <ListGroup>
                {courseData.sessions.map(session => (
                  <ListGroup.Item key={session.id} className="mb-2 border rounded">
                    <div className="d-flex w-100 justify-content-between align-items-center">
                      <h6 className="mb-1">{session.titre}</h6>
                      <Button 
                        variant="outline-success" 
                        size="sm" 
                        onClick={() => onDownloadRoster(session.id, session.titre)}
                        title={`Télécharger la liste pour la session "${session.titre}"`}
                      >
                         <FaFileExcel className="me-1" /> Télécharger la liste
                      </Button>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                        <div>
                            <p className="mb-1">
                                <strong>Statut:</strong> <Badge bg={getSessionStatusBadge(session.statut).class}>
                                    {getSessionStatusBadge(session.statut).text}
                                </Badge>
                            </p>
                            <p className="mb-1"><strong>Dates:</strong> Du {formatDate(session.date_debut)} au {formatDate(session.date_fin)}</p>
                        </div>
                        <div className="text-end">
                            <p className="mb-1"><strong>Prix:</strong> {formatCurrency(session.prix)}</p>
                            <p className="mb-0"><strong>Places:</strong> {session.places_disponibles} / {session.capacite_maximale}</p>
                        </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p className="text-muted">Aucune session n'est actuellement programmée pour ce cours.</p>
            )}
            {/* --- End of Sessions Section --- */}

          </>
        ) : (
          <p className="text-danger text-center">Impossible de charger les détails du cours.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Fermer</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CourseDetailsModal;