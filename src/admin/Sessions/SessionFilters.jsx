
import React from 'react';
import { FaSearch, FaBook, FaUsers, FaUndo } from 'react-icons/fa';

const SessionFilters = ({ 
  search, 
  setSearch, 
  coursId, 
  setCoursId, 
  disponibles, 
  setDisponibles, 
  coursesData, 
  resetFilters 
}) => {
  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleCoursIdChange = (e) => setCoursId(e.target.value);
  const handleDisponiblesChange = (e) => setDisponibles(e.target.checked);

  const clearSearch = () => setSearch('');
  const clearCoursId = () => setCoursId('');

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
          <div className="col-12 col-sm-6 col-lg-3">
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
        {(search || coursId || disponibles) && (
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