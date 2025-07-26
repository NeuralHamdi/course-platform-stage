import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FaEye, FaPen, FaTrash, FaPlus, FaSearch, FaClock, FaLayerGroup, FaFolder, FaUndo } from 'react-icons/fa';
import { Modal, Button, Form } from 'react-bootstrap';
import ModalAddCourse from './ModalAddCourse';

// --- COMPOSANT MODAL POUR LES DÉTAILS DU COURS ---
const CourseDetailsModal = ({ show, handleClose, data, isLoading }) => {
  const courseData = data;

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Détails du cours</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <p>🔄 Chargement des détails...</p>
        ) : courseData ? (
          <>
            <div className="row">
              <div className="col-md-4">
                <img
                  src={courseData.url_image}
                  alt={courseData.titre}
                  className="img-fluid rounded"
                />
              </div>
              <div className="col-md-8">
                <h5>{courseData.titre}</h5>
                <p><strong>Description:</strong> {courseData.description}</p>
                <p><strong>Niveau:</strong> <span className={`badge ${
                  courseData.niveau === 'Beginner' ? 'bg-success' :
                  courseData.niveau === 'Intermediate' ? 'bg-warning' :
                  'bg-danger'
                }`}>
                  {courseData.niveau === 'Beginner' ? 'Débutant' :
                   courseData.niveau === 'Intermediate' ? 'Intermédiaire' :
                   'Avancé'}
                </span></p>
                <p><strong>Durée:</strong> {courseData.duree} {courseData.duree_unite}</p>
                <p><strong>Prix:</strong> {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR'
                }).format(parseFloat(courseData.prix_reference))}</p>
                <p><strong>Module:</strong> {courseData.module_id}</p>
                <p><strong>Créé le:</strong> {new Date(courseData.created_at).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
            <hr />
            <h6>À propos du cours</h6>
            <p>{courseData.about}</p>
            <h6>Objectifs</h6>
            {courseData.objectifs && courseData.objectifs.length > 0 ? (
              <ul>
                {courseData.objectifs.map((objectif, index) => (
                  <li key={index}>{objectif}</li>
                ))}
              </ul>
            ) : (
              <p>Aucun objectif spécifié.</p>
            )}
          </>
        ) : (
          <p className="text-danger">Impossible de charger les détails du cours.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Fermer</Button>
      </Modal.Footer>
    </Modal>
  );
};

// --- MODAL DE MISE À JOUR DU COURS ---
const CourseUpdateModal = ({ show, handleClose, course, onUpdate, updateMutation }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (course) {
      setFormData({
        titre: course.titre || '',
        description: course.description || '',
        about: course.about || '',
        duree: course.duree || '',
        duree_unite: course.duree_unite || 'weeks',
        niveau: course.niveau || 'Beginner',
        prix_reference: course.prix_reference || '',
        url_image: course.url_image || '',
       
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  if (!course) return null;

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Modifier le cours</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Titre</Form.Label>
                <Form.Control 
                  type="text" 
                  name="titre" 
                  value={formData.titre} 
                  onChange={handleChange} 
                  required 
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Prix (€)</Form.Label>
                <Form.Control 
                  type="number" 
                  step="0.01"
                  name="prix_reference" 
                  value={formData.prix_reference} 
                  onChange={handleChange} 
                  required 
                />
              </Form.Group>
            </div>
          </div>
          
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3}
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              required 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>À propos</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={4}
              name="about" 
              value={formData.about} 
              onChange={handleChange} 
            />
          </Form.Group>

          <div className="row">
            <div className="col-md-4">
              <Form.Group className="mb-3">
                <Form.Label>Durée</Form.Label>
                <Form.Control 
                  type="number" 
                  name="duree" 
                  value={formData.duree} 
                  onChange={handleChange} 
                  required 
                />
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group className="mb-3">
                <Form.Label>Unité</Form.Label>
                <Form.Select name="duree_unite" value={formData.duree_unite} onChange={handleChange}>
                  <option value="hours">Heures</option>
                  <option value="days">Jours</option>
                  <option value="weeks">Semaines</option>
                  <option value="months">Mois</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group className="mb-3">
                <Form.Label>Niveau</Form.Label>
                <Form.Select name="niveau" value={formData.niveau} onChange={handleChange}>
                  <option value="Beginner">Débutant</option>
                  <option value="Intermediate">Intermédiaire</option>
                  <option value="Advanced">Avancé</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>

          <div className="row">
           
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>URL Image</Form.Label>
                <Form.Control 
                  type="url" 
                  name="url_image" 
                  value={formData.url_image} 
                  onChange={handleChange} 
                />
              </Form.Group>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Annuler</Button>
          <Button variant="primary" type="submit" disabled={updateMutation?.isLoading}>
            {updateMutation?.isLoading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

// --- FONCTIONS API ---
const fetchCourses = async ({ queryKey }) => {
  const [, { search, moduleId, level, duration, page }] = queryKey;
  const token = localStorage.getItem('token');
  const response = await axios.get('http://mon-projet.test/api/courses/paginate', {
    headers: { Authorization: `Bearer ${token}` },
    params: { search, module_id: moduleId, level, duration, page, per_page: 10 },
  });
  return response.data;
};

const fetchCourseDetails = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`http://mon-projet.test/api/courses/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const updateCourse = async ({ id, ...data }) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`http://mon-projet.test/api/courses/update/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const deleteCourse = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`http://mon-projet.test/api/course/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// --- COMPOSANT PRINCIPAL : AdminCoursesPage ---
const CoursesPage = () => {
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');
  const [duration, setDuration] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [page, setPage] = useState(1);

  // State pour les modals
  const [selectedIdForDetails, setSelectedIdForDetails] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);


  const queryClient = useQueryClient();

  // Query pour la liste des cours avec pagination
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['courses-paginated', { search, moduleId, level, duration, page }],
    queryFn: fetchCourses,
    keepPreviousData: true,
    staleTime: 30000, // 30 secondes
  });

  // Query pour les détails d'un cours
  const { data: selectedCourse, isFetching: isFetchingDetail } = useQuery({
    queryKey: ['courseDetail', selectedIdForDetails],
    queryFn: () => fetchCourseDetails(selectedIdForDetails),
    enabled: !!selectedIdForDetails,
  });

  // Mutation pour la suppression
  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['courses-paginated'] });
      alert(data.message || 'Cours supprimé avec succès!');
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression:', error);
      const errorMessage = error.response?.data?.message || "Échec de la suppression du cours.";
      alert(errorMessage);
    },
  });

  // Mutation pour la mise à jour
  const updateMutation = useMutation({
    mutationFn: updateCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses-paginated'] });
      alert('Cours mis à jour avec succès!');
      setUpdateModalVisible(false);
      setCourseToEdit(null);
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour:", error);
      alert(`Échec de la mise à jour: ${error.response?.data?.message || error.message}`);
    }
  });

  // Handlers pour les filtres
  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleLevelChange = (e) => setLevel(e.target.value);
  const handleDurationChange = (e) => setDuration(e.target.value);
  const handleModuleIdChange = (e) => setModuleId(e.target.value);
  const handlePageChange = (newPage) => setPage(newPage);

  const clearSearch = () => setSearch('');
  const clearLevel = () => setLevel('');
  const clearDuration = () => setDuration('');
  const clearModuleId = () => setModuleId('');

  const resetFilters = () => {
    setSearch('');
    setLevel('');
    setDuration('');
    setModuleId('');
  };

  // Handler pour la suppression
  const handleDelete = (courseId, courseTitle) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le cours "${courseTitle}" ?`)) {
      deleteMutation.mutate(courseId);
    }
  };

  // Handler pour ouvrir le modal de mise à jour
  const handleOpenUpdateModal = (course) => {
    setCourseToEdit(course);
    setUpdateModalVisible(true);
  };

  // Handler pour soumettre la mise à jour
  const handleUpdate = (updatedData) => {
    updateMutation.mutate({ id: courseToEdit.id, ...updatedData });
  };

  // Fonction pour formater la durée
  const formatDuration = (duree, dureeUnite) => {
    const unitMap = {
      'hours': 'heures',
      'days': 'jours',
      'weeks': 'semaines',
      'months': 'mois'
    };
    return `${duree} ${unitMap[dureeUnite] || dureeUnite}`;
  };

  // Fonction pour formater le prix
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(parseFloat(price));
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          {/* En-tête */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h3 mb-0">
              <FaLayerGroup className="me-2 text-primary" />
              Gestion des Cours
            </h2>
           <Button variant="primary" onClick={() => setAddModalVisible(true)}>
  <FaPlus className="me-2" />
  Nouveau Cours
</Button>

          </div>

          {/* Barre de recherche et filtres */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row gx-2 gy-2 align-items-end">
                {/* Recherche par nom */}
                <div className="col-12 col-sm-6 col-md-3">
                  <label className="form-label">
                    <FaSearch className="me-1" />
                    Rechercher par titre
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nom du cours..."
                      value={search}
                      onChange={handleSearchChange}
                    />
                    {search && (
                      <button className="btn btn-outline-secondary" onClick={clearSearch}>
                        &times;
                      </button>
                    )}
                  </div>
                </div>

                {/* Filtre par niveau */}
                <div className="col-12 col-sm-6 col-md-2">
                  <label className="form-label">
                    <FaLayerGroup className="me-1" />
                    Niveau
                  </label>
                  <div className="input-group">
                    <select
                      className="form-select"
                      value={level}
                      onChange={handleLevelChange}
                    >
                      <option value="">Tous les niveaux</option>
                      <option value="Beginner">Débutant</option>
                      <option value="Intermediate">Intermédiaire</option>
                      <option value="Advanced">Avancé</option>
                    </select>
                    {level && (
                      <button className="btn btn-outline-secondary" onClick={clearLevel}>
                        &times;
                      </button>
                    )}
                  </div>
                </div>

                {/* Filtre par durée */}
                <div className="col-12 col-sm-6 col-md-2">
                  <label className="form-label">
                    <FaClock className="me-1" />
                    Unité de durée
                  </label>
                  <div className="input-group">
                    <select
                      className="form-select"
                      value={duration}
                      onChange={handleDurationChange}
                    >
                      <option value="">Toutes les durées</option>
                      <option value="hours">Heures</option>
                      <option value="days">Jours</option>
                      <option value="weeks">Semaines</option>
                      <option value="months">Mois</option>
                    </select>
                    {duration && (
                      <button className="btn btn-outline-secondary" onClick={clearDuration}>
                        &times;
                      </button>
                    )}
                  </div>
                </div>

                {/* Filtre par module */}
                <div className="col-12 col-sm-6 col-md-2">
                  <label className="form-label">
                    <FaFolder className="me-1" />
                    Module ID
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="ID Module"
                      value={moduleId}
                      onChange={handleModuleIdChange}
                    />
                    {moduleId && (
                      <button className="btn btn-outline-secondary" onClick={clearModuleId}>
                        &times;
                      </button>
                    )}
                  </div>
                </div>

                {/* Bouton reset */}
                <div className="col-12 col-md-3 d-grid">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={resetFilters}
                  >
                    <FaUndo className="me-1" />
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* États de chargement et d'erreur */}
          {isFetching && <div className="text-muted mb-2">🔄 Recherche en cours...</div>}
          {isError && <div className="text-danger mb-2">Erreur lors du chargement.</div>}
          {deleteMutation.isLoading && <div className="text-info mb-2">Suppression en cours...</div>}
          {updateMutation.isLoading && <div className="text-info mb-2">Mise à jour en cours...</div>}

          {/* Tableau des cours */}
          {!isLoading && (
            <>
              <div className="card">
                <div className="card-header bg-light">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">
                      Liste des Cours
                    </h5>
                    <div className="text-muted">
                      <small>
                        Page {data?.current_page || 1} sur {data?.last_page || 1} 
                        ({data?.total || 0} cours au total)
                      </small>
                    </div>
                  </div>
                </div>
                <div className="card-body p-0">
                  {!data?.data || data.data.length === 0 ? (
                    <div className="text-center py-5">
                      <FaSearch className="fa-3x text-muted mb-3" />
                      <p className="text-muted">Aucun cours trouvé avec ces critères.</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Titre</th>
                            <th>Description</th>
                            <th>Niveau</th>
                            <th>Durée</th>
                            <th>Prix</th>
                            <th>Module</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.data.map((course) => (
                            <tr key={course.id}>
                              <td>
                                <span className="badge bg-primary">{course.id}</span>
                              </td>
                              <td>
                                <img
                                  src={course.url_image}
                                  alt={course.titre}
                                  className="img-thumbnail"
                                  style={{ width: '60px', height: '45px', objectFit: 'cover' }}
                                />
                              </td>
                              <td>
                                <div className="fw-semibold">{course.titre}</div>
                                <small className="text-muted">
                                  Créé le {new Date(course.created_at).toLocaleDateString('fr-FR')}
                                </small>
                              </td>
                              <td>
                                <div
                                  className="text-truncate"
                                  style={{ maxWidth: '200px' }}
                                  title={course.description}
                                >
                                  {course.description}
                                </div>
                              </td>
                              <td>
                                <span className={`badge ${
                                  course.niveau === 'Beginner' ? 'bg-success' :
                                  course.niveau === 'Intermediate' ? 'bg-warning' :
                                  'bg-danger'
                                }`}>
                                  {course.niveau === 'Beginner' ? 'Débutant' :
                                   course.niveau === 'Intermediate' ? 'Intermédiaire' :
                                   'Avancé'}
                                </span>
                              </td>
                              <td>
                                <FaClock className="me-1 text-muted" />
                                {formatDuration(course.duree, course.duree_unite)}
                              </td>
                              <td>
                                <span className="fw-semibold text-success">
                                  {formatPrice(course.prix_reference)}
                                </span>
                              </td>
                              <td>
                                <span className="badge bg-info">
                                  Module {course.module_id}
                                </span>
                              </td>
                              <td>
                                <FaEye
                                  className="me-2 text-info"
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => {
                                    setSelectedIdForDetails(course.id);
                                    setDetailsModalVisible(true);
                                  }}
                                  title="Voir détails"
                                />
                                <FaPen
                                  className="me-2 text-warning"
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => handleOpenUpdateModal(course)}
                                  title="Modifier"
                                />
                                <FaTrash
                                  className="text-danger"
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => handleDelete(course.id, course.titre)}
                                  disabled={deleteMutation.isLoading}
                                  title="Supprimer"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Pagination améliorée */}
              {data?.links && data.links.length > 3 && (
                <div className="card mt-3">
                  <div className="card-body py-3">
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center">
                          <span className="text-muted me-3">
                            Affichage de {data.from || 0} à {data.to || 0} sur {data.total || 0} cours
                          </span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <nav>
                          <ul className="pagination justify-content-end mb-0">
                            {/* Bouton Précédent */}
                            <li className={`page-item ${data.current_page === 1 ? 'disabled' : ''}`}>
                              <button
                                className="page-link"
                                onClick={() => data.current_page > 1 && handlePageChange(data.current_page - 1)}
                                disabled={data.current_page === 1}
                              >
                                <span>&laquo;</span>
                              </button>
                            </li>

                            {/* Pages numérotées */}
                            {(() => {
                              const currentPage = data.current_page;
                              const lastPage = data.last_page;
                              const pages = [];
                              
                              // Logique pour afficher les pages
                              let startPage = Math.max(1, currentPage - 2);
                              let endPage = Math.min(lastPage, currentPage + 2);
                              
                              // Ajuster si on est au début
                              if (currentPage <= 3) {
                                endPage = Math.min(5, lastPage);
                              }
                              
                              // Ajuster si on est à la fin
                              if (currentPage >= lastPage - 2) {
                                startPage = Math.max(1, lastPage - 4);
                              }
                              
                              // Page 1 si pas incluse
                              if (startPage > 1) {
                                pages.push(
                                  <li key={1} className="page-item">
                                    <button
                                      className="page-link"
                                      onClick={() => handlePageChange(1)}
                                    >
                                      1
                                    </button>
                                  </li>
                                );
                                if (startPage > 2) {
                                  pages.push(
                                    <li key="start-ellipsis" className="page-item disabled">
                                      <span className="page-link">...</span>
                                    </li>
                                  );
                                }
                              }
                              
                              // Pages principales
                              for (let i = startPage; i <= endPage; i++) {
                                pages.push(
                                  <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
                                    <button
                                      className="page-link"
                                      onClick={() => handlePageChange(i)}
                                    >
                                      {i}
                                    </button>
                                  </li>
                                );
                              }
                              
                              // Dernière page si pas incluse
                              if (endPage < lastPage) {
                                if (endPage < lastPage - 1) {
                                  pages.push(
                                    <li key="end-ellipsis" className="page-item disabled">
                                      <span className="page-link">...</span>
                                    </li>
                                  );
                                }
                                pages.push(
                                  <li key={lastPage} className="page-item">
                                    <button
                                      className="page-link"
                                      onClick={() => handlePageChange(lastPage)}
                                    >
                                      {lastPage}
                                    </button>
                                  </li>
                                );
                              }
                              
                              return pages;
                            })()}

                            {/* Bouton Suivant */}
                            <li className={`page-item ${data.current_page === data.last_page ? 'disabled' : ''}`}>
                              <button
                                className="page-link"
                                onClick={() => data.current_page < data.last_page && handlePageChange(data.current_page + 1)}
                                disabled={data.current_page === data.last_page}
                              >
                                <span>&raquo;</span>
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Modal pour les détails */}
          <CourseDetailsModal
            show={detailsModalVisible}
            handleClose={() => {
              setDetailsModalVisible(false);
              setSelectedIdForDetails(null);
            }}
            data={selectedCourse}
            isLoading={isFetchingDetail}
          />

          {/* Modal pour la mise à jour */}
          <CourseUpdateModal
            show={updateModalVisible}
            handleClose={() => {
              setUpdateModalVisible(false);
              setCourseToEdit(null);
            }}
            course={courseToEdit}
            onUpdate={handleUpdate}
            updateMutation={updateMutation}
          />
          <ModalAddCourse show={addModalVisible} handleClose={() => setAddModalVisible(false)} />

        </div>
      </div>
    </div>
  );
};

export default CoursesPage;