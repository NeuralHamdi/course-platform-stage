import React from 'react';
import { FaSearch, FaLayerGroup, FaClock, FaFolder, FaUndo, FaUsers, FaSortAmountUp, FaSortAmountDown } from 'react-icons/fa';

const CourseFilters = ({ filters, setFilters, resetFilters }) => {
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value, page: 1 })); // Reset page on filter change
    };

    const clearInput = (name) => {
        setFilters(prev => ({ ...prev, [name]: '', page: 1 }));
    };

    return (
        <div className="card mb-4">
            <div className="card-body">
                <div className="row gx-3 gy-3 align-items-end">
                    {/* Search by Title */}
                    <div className="col-12 col-sm-6 col-lg-3">
                        <label className="form-label">
                            <FaSearch className="me-1" /> Rechercher par titre
                        </label>
                        <div className="input-group">
                            <input 
                                type="text" 
                                className="form-control" 
                                name="search" 
                                placeholder="Nom du cours..." 
                                value={filters.search} 
                                onChange={handleInputChange} 
                            />
                            {filters.search && (
                                <button 
                                    className="btn btn-outline-secondary" 
                                    onClick={() => clearInput('search')}
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filter by Level */}
                    <div className="col-12 col-sm-6 col-lg-2">
                        <label className="form-label">
                            <FaLayerGroup className="me-1" /> Niveau
                        </label>
                        <div className="input-group">
                            <select 
                                className="form-select" 
                                name="level" 
                                value={filters.level} 
                                onChange={handleInputChange}
                            >
                                <option value="">Tous</option>
                                <option value="Beginner">Débutant</option>
                                <option value="Intermediate">Intermédiaire</option>
                                <option value="Advanced">Avancé</option>
                            </select>
                            {filters.level && (
                                <button 
                                    className="btn btn-outline-secondary" 
                                    onClick={() => clearInput('level')}
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filter by Duration Unit */}
                    <div className="col-12 col-sm-6 col-lg-2">
                        <label className="form-label">
                            <FaClock className="me-1" /> Unité de durée
                        </label>
                        <div className="input-group">
                            <select 
                                className="form-select" 
                                name="duration" 
                                value={filters.duration} 
                                onChange={handleInputChange}
                            >
                                <option value="">Toutes</option>
                                <option value="hours">Heures</option>
                                <option value="days">Jours</option>
                                <option value="weeks">Semaines</option>
                            </select>
                            {filters.duration && (
                                <button 
                                    className="btn btn-outline-secondary" 
                                    onClick={() => clearInput('duration')}
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filter by Module ID */}
                    <div className="col-12 col-sm-6 col-lg-2">
                        <label className="form-label">
                            <FaFolder className="me-1" /> Module ID
                        </label>
                        <div className="input-group">
                            <input 
                                type="number" 
                                className="form-control" 
                                name="moduleId" 
                                placeholder="ID" 
                                value={filters.moduleId} 
                                onChange={handleInputChange} 
                            />
                            {filters.moduleId && (
                                <button 
                                    className="btn btn-outline-secondary" 
                                    onClick={() => clearInput('moduleId')}
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                    </div>

                    {/* NEW: Sort by Enrollment */}
                    <div className="col-12 col-sm-6 col-lg-2">
                        <label className="form-label">
                            <FaUsers className="me-1" /> Tri par inscriptions
                        </label>
                        <div className="input-group">
                            <select 
                                className="form-select" 
                                name="enrollmentSort" 
                                value={filters.enrollmentSort || ''} 
                                onChange={handleInputChange}
                            >
                                <option value="">Aucun tri</option>
                                <option value="desc">
                                    📈 Plus inscrit en premier
                                </option>
                                <option value="asc">
                                    📉 Moins inscrit en premier
                                </option>
                            </select>
                            {filters.enrollmentSort && (
                                <button 
                                    className="btn btn-outline-secondary" 
                                    onClick={() => clearInput('enrollmentSort')}
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Reset Button */}
                    <div className="col-12 col-lg-1 d-grid">
                        <button 
                            className="btn btn-outline-secondary" 
                            onClick={resetFilters}
                            title="Réinitialiser tous les filtres"
                        >
                            <FaUndo />
                        </button>
                    </div>
                </div>

                {/* Information about current sorting */}
                {filters.enrollmentSort && (
                    <div className="mt-2">
                        <small className="text-muted d-flex align-items-center">
                            {filters.enrollmentSort === 'desc' ? (
                                <>
                                    <FaSortAmountDown className="me-1 text-primary" />
                                    Tri par nombre d'inscriptions (décroissant)
                                </>
                            ) : (
                                <>
                                    <FaSortAmountUp className="me-1 text-primary" />
                                    Tri par nombre d'inscriptions (croissant)
                                </>
                            )}
                        </small>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseFilters;