import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaCalendarAlt, FaBook, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';

const SessionDetailsModal = ({ show, handleClose, data, isLoading }) => {
  const getStatusBadge = (statut) => {
    switch (statut) {
      case 'active':
        return <span className="badge bg-success"><FaCheckCircle className="me-1" />Active</span>;
      case 'terminee':
        return <span className="badge bg-secondary"><FaTimesCircle className="me-1" />Terminée</span>;
      case 'en_cours':
        return <span className="badge bg-warning"><FaHourglassHalf className="me-1" />En cours</span>;
      default:
        return <span className="badge bg-light text-dark">{statut}</span>;
    }
  };

  const formatDuration = (duree, dureeUnite) => {
    const unitMap = {
      'hours': 'heures',
      'days': 'jours', 
      'weeks': 'semaines',
      'months': 'mois'
    };
    return `${duree} ${unitMap[dureeUnite] || dureeUnite}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(parseFloat(price));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Détails de la session</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-2">Chargement des détails...</p>
          </div>
        ) : data ? (
          <>
            <div className="row">
              <div className="col-md-4">
                {data.cours?.url_image && (
                  <img
                    src={data.cours.url_image}
                    alt={data.titre}
                    className="img-fluid rounded"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=Image+non+disponible';
                    }}
                  />
                )}
              </div>
              <div className="col-md-8">
                <h5>{data.titre}</h5>
                <p><strong>Cours:</strong> {data.cours?.titre || 'Non spécifié'}</p>
                <p><strong>Prix:</strong> {formatPrice(data.prix)}</p>
                <p><strong>Statut:</strong> {getStatusBadge(data.statut)}</p>
                <p><strong>Capacité:</strong> {data.capacite_maximale} places</p>
                <p><strong>Places disponibles:</strong> 
                  <span className={`ms-2 badge ${data.places_disponibles > 0 ? 'bg-success' : 'bg-danger'}`}>
                    {data.places_disponibles}
                  </span>
                </p>
                <p><strong>Créée le:</strong> {new Date(data.created_at).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
            
            <hr />
            
            <div className="row">
              <div className="col-md-6">
                <h6><FaCalendarAlt className="me-2" />Dates importantes</h6>
                <p><strong>Début:</strong> {formatDate(data.date_debut)}</p>
                <p><strong>Fin:</strong> {formatDate(data.date_fin)}</p>
                {data.date_fin_inscription && (
                  <p><strong>Fin inscription:</strong> {new Date(data.date_fin_inscription).toLocaleDateString('fr-FR')}</p>
                )}
              </div>
              
              <div className="col-md-6">
                <h6><FaBook className="me-2" />Informations du cours</h6>
                {data.cours && (
                  <>
                    <p><strong>Description:</strong> {data.cours.description || 'Non spécifiée'}</p>
                    <p><strong>Niveau:</strong> <span className={`badge ${
                      data.cours.niveau === 'Beginner' ? 'bg-success' :
                      data.cours.niveau === 'Intermediate' ? 'bg-warning' :
                      'bg-danger'
                    }`}>
                      {data.cours.niveau === 'Beginner' ? 'Débutant' :
                       data.cours.niveau === 'Intermediate' ? 'Intermédiaire' :
                       'Avancé'}
                    </span></p>
                    {data.cours.duree && (
                      <p><strong>Durée:</strong> {formatDuration(data.cours.duree, data.cours.duree_unite)}</p>
                    )}
                    <p><strong>Module:</strong> {data.cours.module_id || 'Non spécifié'}</p>
                  </>
                )}
              </div>
            </div>

            {data.cours?.about && (
              <>
                <hr />
                <h6>À propos du cours</h6>
                <p>{data.cours.about}</p>
              </>
            )}

            {data.cours?.objectifs && data.cours.objectifs.length > 0 && (
              <>
                <h6>Objectifs</h6>
                <ul>
                  {data.cours.objectifs.map((objectif, index) => (
                    <li key={index}>{objectif}</li>
                  ))}
                </ul>
              </>
            )}
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-danger">Impossible de charger les détails de la session.</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Fermer</Button>
      </Modal.Footer>
    </Modal>
  );
};
export default SessionDetailsModal;