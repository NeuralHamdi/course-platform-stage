import React, { useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"; // Import both hooks
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaGraduationCap, FaStar, FaUsers, FaPlay, FaFilter, FaSearch, FaChartLine } from 'react-icons/fa';
import apiClient from "../Api/apiClient";
import Hero from '../assets/hero-image.jpg';
import '../style/Programms.css';

export default function FilterCourses() {
    const [search, setSearch] = useState("");
    const [moduleId, setModuleId] = useState("");
    const [level, setLevel] = useState("");
    const [duration, setDuration] = useState("");

    // Fetches a specific page of courses based on filters
    const fetchCourses = async ({ pageParam = 1 }) => {
        const response = await apiClient.get("/courses", {
            params: {
                page: pageParam, // Pass the page number to the API
                search: search,
                module_id: moduleId,
                level: level,
                duration: duration,
            },
        });
        return response.data;
    };

    // Switched to useInfiniteQuery for "load more" functionality
    const {
        data,
        error,
        isError,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetchingNextPage, // State to know when loading the next page
    } = useInfiniteQuery({
        queryKey: ['courses', search, moduleId, level, duration],
        queryFn: fetchCourses,
        // Tells React Query how to get the number for the next page
        getNextPageParam: (lastPage, pages) => {
            return lastPage.current_page < lastPage.last_page
                ? lastPage.current_page + 1
                : undefined;
        },
    });

    // Fetching modules remains the same (can use a standard useQuery)
    const fetchModules = async () => {
        const response = await apiClient.get("/modules/all");
        return response.data;
    };

    const { data: modules = [] } = useQuery({
        queryKey: ['modules'],
        queryFn: fetchModules,
    });

    const clearFilters = () => {
        setSearch("");
        setModuleId("");
        setLevel("");
        setDuration("");
    };
    
    // --- NO CHANGES to these helper functions ---
    const getLevelColor = (niveau) => {
        switch (niveau) {
            case 'Beginner': return 'success';
            case 'Intermediate': return 'warning';
            case 'Advanced': return 'danger';
            default: return 'secondary';
        }
    };

    const getDurationIcon = (dureeUnite) => {
        switch (dureeUnite) {
            case 'hours': return '⏰';
            case 'days': return '📅';
            case 'weeks': return '📆';
            default: return '⏱️';
        }
    };
    
    const getPriceDisplayInfo = (sessions) => {
        if (!Array.isArray(sessions) || sessions.length === 0) {
            return { text: "Bientôt disponible", color: "secondary" };
        }
        const prices = sessions.map(s => parseFloat(s.prix));
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        if (maxPrice === 0) {
            return { text: "Gratuit", color: "success" };
        }
        if (minPrice === maxPrice) {
            return {
                text: `${minPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`,
                color: "primary"
            };
        }
        return {
            text: `À partir de ${minPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`,
            color: "success"
        };
    };
    // --- END of helper functions ---

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
                        <div className="stat-item"><FaUsers className="me-2" /><span>+1000 Étudiants</span></div>
                        <div className="stat-item"><FaStar className="me-2" /><span>4.8/5 Étoiles</span></div>
                        <div className="stat-item"><FaPlay className="me-2" /><span>Formations Certifiantes</span></div>
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
                        <div className="col-md-6 col-lg-3">
                            <select className="form-select" value={moduleId} onChange={(e) => setModuleId(e.target.value)}>
                                <option value="">🎯 Tous les Domaines</option>
                                {Array.isArray(modules) && modules.map((module) => (
                                    <option key={module.id} value={module.id}>{module.titre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <select className="form-select" value={duration} onChange={(e) => setDuration(e.target.value)}>
                                <option value="">⏰ Toutes les Durées</option>
                                <option value="hours">Heures</option>
                                <option value="days">Jours</option>
                                <option value="weeks">Semaines</option>
                            </select>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <select className="form-select" value={level} onChange={(e) => setLevel(e.target.value)}>
                                <option value="">📊 Tous les Niveaux</option>
                                <option value="Beginner">🌱 Débutant</option>
                                <option value="Intermediate">📈 Intermédiaire</option>
                                <option value="Advanced">🚀 Avancé</option>
                            </select>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end gap-3 mt-4">
                        <motion.button onClick={clearFilters} className="btn btn-outline-secondary btn-action" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            ✖ Effacer
                        </motion.button>
                        {/* The refetch is now handled automatically by react-query on filter change */}
                    </div>
                </motion.div>

                {/* Initial Loading State */}
                {isLoading && (
                    <motion.div className="loading-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="loading-spinner"></div>
                        <p className="loading-text">Chargement des formations...</p>
                    </motion.div>
                )}

                {/* Error State */}
                {isError && (
                    <motion.div className="alert alert-danger error-alert mx-auto text-center" style={{ maxWidth: '500px' }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                        <h5 className="alert-heading">Erreur de chargement</h5>
                        <p className="mb-0">{error.message}</p>
                    </motion.div>
                )}

                {/* Courses Grid - Updated to render pages */}
                <motion.div
                    className="row g-4 mt-4"
                    variants={{
                        hidden: { opacity: 0 },
                        show: { opacity: 1, transition: { staggerChildren: 0.1 } },
                    }}
                    initial="hidden"
                    animate="show"
                >
                    {data?.pages.map((page, i) => (
                        <React.Fragment key={i}>
                            {page.data.map((course) => {
                                const priceInfo = getPriceDisplayInfo(course.sessions);
                                return (
                                    <motion.div
                                        key={course.id}
                                        className="col-lg-4 col-md-6"
                                        variants={{
                                            hidden: { opacity: 0, y: 30 },
                                            show: { opacity: 1, y: 0 },
                                        }}
                                        layout // Smooth animation on new items loading
                                    >
                                        <div className="card h-100 gradient-border-card premium-shadow">
                                            <div className="position-relative overflow-hidden">
                                                <img className="card-img-top" src={course.url_imag || Hero} alt={course.titre} />
                                                <div className="image-overlay"></div>
                                                <span className={`badge bg-${getLevelColor(course.niveau)} level-badge`}>{course.niveau}</span>
                                                <div className="duration-badge">
                                                    <span className="me-2">{getDurationIcon(course.duree_unite)}</span>
                                                    {course.duree} {course.duree_unite}
                                                </div>
                                            </div>
                                            <div className="card-body d-flex flex-column">
                                                <h5 className="card-title">{course.titre || "Formation disponible"}</h5>
                                                <p className="card-text flex-grow-1">{course.description}</p>
                                                <div className="course-stats">
                                                    <div className="stat-item-card"><FaChartLine /><span>{course.niveau}</span></div>
                                                    <div className={`price-tag text-${priceInfo.color}`}>{priceInfo.text}</div>
                                                </div>
                                                <motion.div className="mt-auto" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                    <Link to={`/courses/${course.id}`} className="card-footer-btn">
                                                        📚 Voir les Détails
                                                    </Link>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </motion.div>

                {/* "Load More" Button Section */}
                <AnimatePresence>
                    {hasNextPage && (
                        <motion.div
                            className="text-center mt-5"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.button
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                                className="load-more-btn"
                                whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isFetchingNextPage ? 'Chargement...' : 'Afficher Plus'}
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* No Results State */}
                {!isLoading && data?.pages[0]?.data.length === 0 && (
                    <motion.div className="no-results" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                        <div className="no-results-icon"><FaSearch /></div>
                        <h3>Aucune formation trouvée</h3>
                        <p>Essayez de modifier vos critères de recherche pour trouver d'autres formations.</p>
                        <motion.button onClick={clearFilters} className="btn reset-filters-btn" whileHover={{ scale: 1.05 }}>
                            Réinitialiser les filtres
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}