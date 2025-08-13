import React from 'react';
import { Modal, Button, Spinner, ListGroup, Badge } from 'react-bootstrap';
import { FaFileExcel } from 'react-icons/fa';

const CourseDetailsModal = ({ show, handleClose, data, isLoading, onDownloadRoster }) => {
  const courseData = data;

  // IMPROVED: Helper now returns a `bgClass` property instead of the reserved keyword 'class'.
  const getLevelBadge = (level) => {
    switch (level) {
      case 'Beginner': return { bgClass: 'success', text: 'Débutant' };
      case 'Intermediate': return { bgClass: 'warning', text: 'Intermédiaire' };
      case 'Advanced': return { bgClass: 'danger', text: 'Avancé' };
      default: return { bgClass: 'secondary', text: level };
    }
  };
  
  // IMPROVED: Helper now returns a `bgClass` property.
  const getSessionStatusBadge = (status) => {
    switch (status) {
      case 'active': return { bgClass: 'success', text: 'Active' };
      case 'a_venir': return { bgClass: 'info', text: 'À venir' };
      case 'terminee': return { bgClass: 'secondary', text: 'Terminée' };
      default: return { bgClass: 'dark', text: status };
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
    currency: 'MAD' // Changed to Moroccan Dirham based on your location, adjust if needed
  }).format(parseFloat(amount));
  
  // IMPROVED: Call the helper function once and store the result
  const levelInfo = courseData ? getLevelBadge(courseData.niveau) : null;

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
                {/* --- FIXED: The badge now displays correctly --- */}
                <p><strong>Niveau:</strong>{' '}
                  <Badge bg={levelInfo.bgClass}>
                    {levelInfo.text}
                  </Badge>
                </p>
                <p><strong>Durée:</strong> {courseData.duree} {courseData.duree_unite}</p>
                {/* NOTE: Consider displaying the module name instead of its ID for better UX */}
                <p><strong>Module:</strong> {courseData.module_id}</p>
                <p><strong>Créé le:</strong> {formatDate(courseData.created_at)}</p>
              </div>
            </div>
            <hr />
            <h6>À propos du cours</h6>
            <p>{courseData.about}</p>
            <h6>Objectifs d'apprentissage</h6>
            {/* IMPROVED: Added Array.isArray check for robustness */}
            {Array.isArray(courseData.objectifs) && courseData.objectifs.length > 0 ? (
              <ul>
                {courseData.objectifs.map((objectif, index) => <li key={index}>{objectif}</li>)}
              </ul>
            ) : (
              <p className="text-muted">Aucun objectif spécifié.</p>
            )}

            {/* --- Sessions Section --- */}
            <hr />
            <h6>Sessions programmées</h6>
            {Array.isArray(courseData.sessions) && courseData.sessions.length > 0 ? (
              <ListGroup>
                {courseData.sessions.map(session => {
                  // IMPROVED: Call helper once per session
                  const sessionStatusInfo = getSessionStatusBadge(session.statut);
                  return (
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
                              <strong>Statut:</strong>{' '}
                              <Badge bg={sessionStatusInfo.bgClass}>
                                {sessionStatusInfo.text}
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
                  );
                })}
              </ListGroup>
            ) : (
              <p className="text-muted">Aucune session n'est actuellement programmée pour ce cours.</p>
            )}
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