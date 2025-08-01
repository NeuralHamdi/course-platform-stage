import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Hero from '../assets/hero-image.jpg'; 
import { FaClock, FaChartLine, FaSearch, FaFilter, FaGraduationCap, FaStar, FaUsers, FaPlay } from 'react-icons/fa';
import { Link } from "react-router-dom"; 
import { motion } from "framer-motion";
import '../style/Programms.css'

export default function FilterCourses() {
  const [search, setSearch] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [level, setLevel] = useState("");
  const [duration, setDuration] = useState("");

  const fetchCourses = async () => {
    const response = await axios.get("http://mon-projet.test/api/courses", {
      params: {
        search: search,
        module_id: moduleId,
        level: level,
        duration: duration, 
      },
    });
    return response.data;
  };

  const { data: courses, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['courses', search, moduleId, level, duration], 
    queryFn: fetchCourses,
  });

  const fetchModules = async () => {
    const response = await axios.get("http://mon-projet.test/api/modules/all");
    return response.data;
  };

  const { data: modules = [], isLoading: modulesLoading, isError: modulesError } = useQuery({
    queryKey: ['modules'],
    queryFn: fetchModules,
  });

  const clearFilters = () => {
    setSearch("");
    setModuleId("");
    setLevel("");
    setDuration("");
    refetch();
  };

  const getLevelColor = (niveau) => {
    switch(niveau) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'danger';
      default: return 'secondary';
    }
  };

  const getDurationIcon = (dureeUnite) => {
    switch(dureeUnite) {
      case 'hours': return '⏰';
      case 'days': return '📅';
      case 'weeks': return '📆';
      default: return '⏱️';
    }
  };
const getPriceDisplayInfo = (sessions) => {
  // Scenario 1: No sessions scheduled yet
  if (!Array.isArray(sessions) || sessions.length === 0) {
    return { text: "Bientôt disponible", color: "secondary" };
  }

  const prices = sessions.map(s => parseFloat(s.prix));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // Scenario 2: The course is free
  if (maxPrice === 0) {
    return { text: "Gratuit", color: "success" };
  }

  // Scenario 3: All sessions have the same price
  if (minPrice === maxPrice) {
    return { 
      text: `${minPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`,
      color: "primary" 
    };
  }

  // Scenario 4: Prices vary, show the minimum price
  return { 
    text: `À partir de ${minPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`,
    color: "success"
  };
};

  return (
    <div className="min-vh-100 animated-background programs-page">
      <div className="container py-5">
        {/* Enhanced Header Section */}
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="page-title">
            <FaGraduationCap className="me-3" />
            Découvrez Nos Formations
          </h1>
          <p className="page-subtitle">
            Explorez notre catalogue de formations professionnelles et trouvez le cours parfait pour votre carrière
          </p>
          <div className="stats-row">
            <div className="stat-item">
              <FaUsers className="me-2" />
              <span>+1000 Étudiants</span>
            </div>
            <div className="stat-item">
              <FaStar className="me-2" />
              <span>4.8/5 Étoiles</span>
            </div>
            <div className="stat-item">
              <FaPlay className="me-2" />
              <span>Formations Certifiantes</span>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Filter Section */}
        <motion.div
          className="filter-container p-4 shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="filter-header">
            <FaFilter />
            <h4>Filtrer les Formations</h4>
          </div>
          
          <div className="row g-4">
            {/* Enhanced Search Input */}
            <div className="col-md-6 col-lg-3">
              <div className="search-input-wrapper">
                <div className="search-icon" />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher une formation..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Enhanced Module Filter */}
            <div className="col-md-6 col-lg-3">
              <select
                className="form-select"
                value={moduleId}
                onChange={(e) => setModuleId(e.target.value)}
              >
                <option value="">🎯 Tous les Domaines</option>
                {Array.isArray(modules) && modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.titre}
                  </option>
                ))}
              </select>
            </div>

            {/* Enhanced Duration Filter */}
            <div className="col-md-6 col-lg-3">
              <select 
                className="form-select"
                value={duration} 
                onChange={(e) => setDuration(e.target.value)}
              >
                <option value="">⏰ Toutes les Durées</option>
                <option value="hours">Heures</option>
                <option value="days">Jours</option>
                <option value="weeks">Semaines</option>
              </select>
            </div>

            {/* Enhanced Level Filter */}
            <div className="col-md-6 col-lg-3">
              <select
                className="form-select"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="">📊 Tous les Niveaux</option>
                <option value="Beginner">🌱 Débutant</option>
                <option value="Intermediate">📈 Intermédiaire</option>
                <option value="Advanced">🚀 Avancé</option>
              </select>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="d-flex justify-content-end gap-3 mt-4">
            <motion.button 
              onClick={clearFilters} 
              className="btn btn-outline-secondary btn-action"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ✖ Effacer
            </motion.button>
            <motion.button 
              onClick={() => refetch()} 
              className="btn btn-primary btn-action"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔍 Rechercher
            </motion.button>
          </div>
        </motion.div>

        {/* Enhanced Loading State */}
        {isLoading && (
          <motion.div 
            className="loading-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="loading-spinner"></div>
            <p className="loading-text">Chargement des formations...</p>
          </motion.div>
        )}

        {/* Enhanced Error State */}
        {isError && (
          <motion.div 
            className="alert alert-danger error-alert mx-auto text-center"
            style={{ maxWidth: '500px' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h5 className="alert-heading">Erreur de chargement</h5>
            <p className="mb-0">{error.message}</p>
          </motion.div>
        )}

        {/* Enhanced Courses Grid */}
        <motion.div
          className="row g-4"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="show"
        >
          {courses?.map((course, index) => {
            const priceInfo=getPriceDisplayInfo(course.sessions);
            return (
            <motion.div
              key={course.id}
              className="col-lg-4 col-md-6"
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 },
              }}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
            >
              <div className="card h-100 gradient-border-card premium-shadow">
                {/* Enhanced Course Image with Overlays */}
                <div className="position-relative overflow-hidden">
                  <img 
                    className="card-img-top" 
                    src={course.url_imag || Hero} 
                    alt={course.titre}
                  />
                  <div className="image-overlay"></div>
                  
                  {/* Level Badge */}
                  <span className={`badge bg-${getLevelColor(course.niveau)} level-badge`}>
                    {course.niveau}
                  </span>
                  
                  {/* Duration Badge */}
                  <div className="duration-badge">
                    <span className="me-2">{getDurationIcon(course.duree_unite)}</span>
                    {course.duree} {course.duree_unite}
                  </div>
                </div>

                {/* Enhanced Card Body */}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">
                    {course.titre || "Formation disponible"}
                  </h5>
                  
                  <p className="card-text flex-grow-1">
                    {course.description}
                  </p>

                  {/* Enhanced Course Stats */}
                  <div className="course-stats">
                    <div className="stat-item-card">
                      <FaChartLine />
                      <span>{course.niveau}</span>
                    </div>
                  <div className={`price-tag text-${priceInfo.color}`}>
                            {priceInfo.text}
                        </div>
                  </div>

                  {/* Enhanced Action Button */}
                  <motion.div
                    className="mt-auto"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link 
                      to={`/courses/${course.id}`} 
                      className="card-footer-btn"
                    >
                      📚 Voir les Détails
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
            );
})}
        </motion.div>

        {/* Enhanced No Results State */}
        {courses?.length === 0 && !isLoading && (
          <motion.div 
            className="no-results"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="no-results-icon">
              <FaSearch />
            </div>
            <h3>Aucune formation trouvée</h3>
            <p>
              Essayez de modifier vos critères de recherche pour trouver d'autres formations.
            </p>
            <motion.button 
              onClick={clearFilters}
              className="btn reset-filters-btn"
              whileHover={{ scale: 1.05 }}
            >
              Réinitialiser les filtres
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}