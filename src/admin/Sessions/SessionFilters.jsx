
import React from 'react';
import { FaSearch, FaBook, FaUsers, FaUndo , FaRegClock} from 'react-icons/fa';
const sessionStatuses = [
  { value: 'a_venir', label: 'À venir' },
  { value: 'active', label: 'Active' },
  { value: 'terminee', label: 'Terminée' },
];
const SessionFilters = ({ 
  search, 
  setSearch, 
  coursId, 
  setCoursId, 
  disponibles, 
  setDisponibles, 
  statut,
  setStatut,
  coursesData, 
  resetFilters 
}) => {
  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleCoursIdChange = (e) => setCoursId(e.target.value);
  const handleDisponiblesChange = (e) => setDisponibles(e.target.checked);
  const handleStatutChange = (e) => setStatut(e.target.value);
  const clearSearch = () => setSearch('');
  const clearCoursId = () => setCoursId('');
    const clearStatut = () => setStatut('');
  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="row gx-3 gy-3 align-items-end">
          {/* Recherche par titre */}
          <div className="col-12 col-sm-6 col-lg-3">
            <label className="form-label">
              <FaSearch className="me-1" />
              Rechercher par titre
            </label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Titre de la session..."
                value={search}
                onChange={handleSearchChange}
              />
              {search && (
                <button 
                  className="btn btn-outline-secondary" 
                  onClick={clearSearch}
                  type="button"
                  title="Effacer la recherche"
                >
                  &times;
                </button>
              )}
            </div>
          </div>

          {/* Filtre par cours */}
          <div className="col-12 col-sm-6 col-lg-2">
            <label className="form-label">
              <FaBook className="me-1" />
              Cours
            </label>
            <div className="input-group">
              <select
                className="form-select"
                value={coursId}
                onChange={handleCoursIdChange}
              >
                <option value="">Tous les cours</option>
                {coursesData?.map((cours) => (
                  <option key={cours.id} value={cours.id}>
                    {cours.titre}
                  </option>
                ))}
              </select>
              {coursId && (
                <button 
                  className="btn btn-outline-secondary" 
                  onClick={clearCoursId}
                  type="button"
                  title="Effacer le filtre cours"
                >
                  &times;
                </button>
              )}
            </div>
          </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-2">
            <label className="form-label">
              <FaRegClock className="me-1" />
              Statut
            </label>
            <div className="input-group">
              <select className="form-select" value={statut} onChange={handleStatutChange}>
                <option value="">Tous les statuts</option>
                {sessionStatuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              {statut && (
                <button className="btn btn-outline-secondary" onClick={clearStatut} type="button" title="Effacer le filtre statut">
                  &times;
                </button>
              )}
            </div>
          </div>

          {/* Filtre places disponibles */}
          <div className="col-12 col-sm-6 col-lg-3">
            <label className="form-label">
              <FaUsers className="me-1" />
              Disponibilité
            </label>
            <div className="form-check mt-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="disponibles"
                checked={disponibles}
                onChange={handleDisponiblesChange}
              />
              <label className="form-check-label" htmlFor="disponibles">
                Places disponibles uniquement
              </label>
            </div>
          </div>

          {/* Bouton reset */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="d-grid">
              <button
                className="btn btn-outline-secondary"
                onClick={resetFilters}
                type="button"
              >
                <FaUndo className="me-1" />
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Filtres actifs */}
        {(search || coursId || disponibles || statut) && (
          <div className="mt-3 pt-3 border-top">
            <small className="text-muted">Filtres actifs:</small>
            <div className="mt-1">
              {search && (
                <span className="badge bg-light text-dark me-2">
                  Recherche: "{search}"
                  <button 
                    className="btn-close btn-sm ms-1" 
                    onClick={clearSearch}
                    style={{ fontSize: '0.6em' }}
                  ></button>
                </span>
              )}
              {coursId && (
                <span className="badge bg-light text-dark me-2">
                  Cours: {coursesData?.find(c => c.id == coursId)?.titre || coursId}
                  <button 
                    className="btn-close btn-sm ms-1" 
                    onClick={clearCoursId}
                    style={{ fontSize: '0.6em' }}
                  ></button>
                </span>
              )}
               {statut && (
                 <span className="badge bg-light text-dark">
                   Statut: {sessionStatuses.find(s => s.value === statut)?.label || statut}
                   <button className="btn-close btn-sm ms-1" onClick={clearStatut} style={{ fontSize: '0.6em' }}></button>
                 </span>
              )}
              {disponibles && (
                <span className="badge bg-light text-dark me-2">
                  Avec places disponibles
                  <button 
                    className="btn-close btn-sm ms-1" 
                    onClick={() => setDisponibles(false)}
                    style={{ fontSize: '0.6em' }}
                  ></button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionFilters;