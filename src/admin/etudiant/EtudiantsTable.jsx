import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { FaEye, FaPen, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';

const EtudiantTable = ({ 
    data, 
    isLoading,
    onViewDetails, 
    onEdit, 
    onDelete, 
    onAddCourse,
    deleteMutation 
}) => {

    if (isLoading) {
        return <div className="text-center p-5"><Spinner animation="border" /></div>;
    }
    
    if (!data?.data || data.data.length === 0) {
        return (
            <div className="text-center py-5 card">
                <FaSearch className="fa-3x text-muted mb-3" />
                <p className="text-muted">Aucun étudiant trouvé.</p>
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
                                <th>Nom Complet</th>
                                <th>Email</th>
                                <th>Date d'inscription</th>
                                <th>Niveau d'études</th>
                                <th>Profession</th>
                                <th style={{width: '150px'}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.data.map((etudiant) => (
                                <tr key={etudiant.id}>
                                    <td><span className="badge bg-primary">{etudiant.id}</span></td>
                                    <td>{etudiant.nom} {etudiant.prenom}</td>
                                    <td>{etudiant.email}</td>
                                    <td>{new Date(etudiant.date_inscription).toLocaleDateString()}</td>
                                    <td>{etudiant.niveau_Etudes}</td>
                                    <td>{etudiant.profession}</td>
                                    <td>
                                        <Button variant="link" className="p-0 me-2 text-info" onClick={() => onViewDetails(etudiant.id)} title="Voir détails"><FaEye /></Button>
                                        <Button variant="link" className="p-0 me-2 text-warning" onClick={() => onEdit(etudiant)} title="Modifier"><FaPen /></Button>
                                        <Button variant="link" className="p-0 me-2 text-danger" onClick={() => onDelete(etudiant.id)} disabled={deleteMutation.isLoading} title="Supprimer"><FaTrash /></Button>
                                        <Button variant="link" className="p-0 text-success" onClick={() => onAddCourse(etudiant.id)} title="Inscrire à un cours"><FaPlus /></Button>
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

export default EtudiantTable;
