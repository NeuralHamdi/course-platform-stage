import React from 'react';
import { FaEye, FaPen, FaTrash, FaClock, FaSearch, FaUsers, FaUserPlus } from 'react-icons/fa';
import { Button } from 'react-bootstrap';

const CourseTable = ({ data, onViewDetails, onEdit, onDelete, deleteMutation }) => {
    const formatDuration = (duree, unite) => `${duree} ${unite}`;
    
    const getLevelBadge = (level) => {
        switch (level) {
          case 'Beginner': return { class: 'bg-success', text: 'Débutant' };
          case 'Intermediate': return { class: 'bg-warning text-dark', text: 'Intermédiaire' };
          case 'Advanced': return { class: 'bg-danger', text: 'Avancé' };
          default: return { class: 'bg-secondary', text: level };
        }
    };

    // Function to format enrollment count with appropriate styling
    const formatEnrollmentCount = (count) => {
        if (count === 0) {
            return (
                <div className="text-center">
                    <span className="badge bg-light text-muted border">
                        <FaUsers className="me-1" />
                        0
                    </span>
                    <div className="mt-1">
                        <small className="text-muted">Aucune inscription</small>
                    </div>
                </div>
            );
        } else if (count <= 5) {
            return (
                <div className="text-center">
                    <span className="badge bg-warning text-dark">
                        <FaUsers className="me-1" />
                        {count}
                    </span>
                    <div className="mt-1">
                        <small className="text-muted">
                            {count === 1 ? 'inscription' : 'inscriptions'}
                        </small>
                    </div>
                </div>
            );
        } else if (count <= 20) {
            return (
                <div className="text-center">
                    <span className="badge bg-info text-dark">
                        <FaUsers className="me-1" />
                        {count}
                    </span>
                    <div className="mt-1">
                        <small className="text-muted">inscriptions</small>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="text-center">
                    <span className="badge bg-success">
                        <FaUserPlus className="me-1" />
                        {count}
                    </span>
                    <div className="mt-1">
                        <small className="text-muted">
                            <strong>Populaire!</strong>
                        </small>
                    </div>
                </div>
            );
        }
    };

    if (!data?.data || data.data.length === 0) {
        return (
            <div className="text-center py-5 card">
                <FaSearch className="fa-3x text-muted mb-3" />
                <p className="text-muted">Aucun cours trouvé avec les critères actuels.</p>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover table-striped mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Image</th>
                                <th>Titre</th>
                                <th style={{minWidth: '200px'}}>Description</th>
                                <th>Niveau</th>
                                <th>Durée</th>
                                <th className="text-center">
                                    <FaUsers className="me-1" />
                                    Inscriptions
                                </th>
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
                                            style={{ maxWidth: '250px' }} 
                                            title={course.description}
                                        >
                                            {course.description}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${getLevelBadge(course.niveau).class}`}>
                                            {getLevelBadge(course.niveau).text}
                                        </span>
                                    </td>
                                    <td>
                                        <FaClock className="me-1 text-muted" />
                                        {formatDuration(course.duree, course.duree_unite)}
                                    </td>
                                    <td>
                                        {/* REPLACED: Prix column with Enrollment count */}
                                        {formatEnrollmentCount(course.total_enrollments || 0)}
                                    </td>
                                    <td>
                                        <span className="badge bg-info text-dark">
                                            Module {course.module_id}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex">
                                            <Button 
                                                variant="link" 
                                                className="p-0 me-2 text-info" 
                                                onClick={() => onViewDetails(course.id)} 
                                                title="Voir détails"
                                            >
                                                <FaEye />
                                            </Button>
                                            <Button 
                                                variant="link" 
                                                className="p-0 me-2 text-warning" 
                                                onClick={() => onEdit(course)} 
                                                title="Modifier"
                                            >
                                                <FaPen />
                                            </Button>
                                            <Button 
                                                variant="link" 
                                                className="p-0 text-danger" 
                                                onClick={() => onDelete(course.id, course.titre)} 
                                                disabled={deleteMutation.isLoading} 
                                                title="Supprimer"
                                            >
                                                <FaTrash />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CourseTable;