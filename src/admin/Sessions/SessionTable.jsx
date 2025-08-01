import React from 'react';
import { FaEye, FaPen, FaTrash, FaSearch, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';

const SessionTable = ({ 
  data, 
  isLoading, 
  onViewDetails, 
  onEdit, 
  onDelete, 
  deleteMutation 
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(parseFloat(price));
  };

  const getStatusBadge = (statut) => {
    switch (statut) {
      case 'active':
        return <span className="badge bg-success"><FaCheckCircle className="me-1" />Active</span>;
      case 'terminee':
        return <span className="badge bg-secondary"><FaTimesCircle className="me-1" />Terminée</span>;
      case 'en_cours':
        return <span className="badge bg-warning text-dark"><FaHourglassHalf className="me-1" />En cours</span>;
      default:
        return <span className="badge bg-light text-dark">{statut}</span>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleDelete = (session) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la session "${session.titre}" ?`)) {
      onDelete(session.id);
    }
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-2">Chargement des sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">
            Liste des Sessions
          </h5>
          <div className="text-muted">
            <small>
              {data?.total || 0} session{(data?.total || 0) > 1 ? 's' : ''} trouvée{(data?.total || 0) > 1 ? 's' : ''}
            </small>
          </div>
        </div>
      </div>
      
      <div className="card-body p-0">
        {!data?.data || data.data.length === 0 ? (
          <div className="text-center py-5">
            <FaSearch className="fa-3x text-muted mb-3" />
            <p className="text-muted mb-0">Aucune session trouvée avec ces critères.</p>
            <small className="text-muted">Essayez de modifier les filtres ou d'ajouter une nouvelle session.</small>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '60px' }}>#</th>
                  <th style={{ minWidth: '200px' }}>Titre</th>
                  <th style={{ minWidth: '180px' }}>Cours</th>
                  <th>Prix</th>
                  <th style={{ minWidth: '120px' }}>Dates</th>
                  <th>Statut</th>
                  <th style={{ width: '100px' }}>Places</th>
                  <th style={{ width: '120px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.data.map((session) => (
                  <tr key={session.id}>
                    <td>
                      <span className="badge bg-primary">{session.id}</span>
                    </td>
                    <td>
                      <div className="fw-semibold">{session.titre}</div>
                      <small className="text-muted">
                        Créée le {formatDate(session.created_at)}
                      </small>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        {session.cours?.url_image && (
                          <img
                            src={session.cours.url_image}
                            alt={session.cours.titre}
                            className="img-thumbnail me-2"
                            style={{ width: '40px', height: '30px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <div className="fw-semibold">{session.cours?.titre || 'Cours non spécifié'}</div>
                          {session.cours?.module_id && (
                            <small className="text-muted">Module {session.cours.module_id}</small>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="fw-semibold text-success">
                        {formatPrice(session.prix)}
                      </span>
                    </td>
                    <td>
                      <div>
                        <small className="text-muted d-block">Début:</small>
                        <span className="fw-semibold small">
                          {formatDate(session.date_debut)}
                        </span>
                      </div>
                      <div className="mt-1">
                        <small className="text-muted d-block">Fin:</small>
                        <span className="fw-semibold small">
                          {formatDate(session.date_fin)}
                        </span>
                      </div>
                    </td>
                    <td>
                      {getStatusBadge(session.statut)}
                    </td>
                    <td>
                      <div className="text-center">
                        <div className={`badge ${session.places_disponibles > 0 ? 'bg-success' : 'bg-danger'}`}>
                          {session.places_disponibles}/{session.capacite_maximale}
                        </div>
                        <div className="mt-1">
                          <small className="text-muted">disponibles</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() => onViewDetails(session.id)}
                          title="Voir détails"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => onEdit(session)}
                          title="Modifier"
                        >
                          <FaPen />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(session)}
                          disabled={deleteMutation?.isLoading}
                          title="Supprimer"
                        >
                          {deleteMutation?.isLoading ? (
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionTable;