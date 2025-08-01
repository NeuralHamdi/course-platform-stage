import React from 'react';
import { Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';

const EtudiantFilters = ({ filters, setFilters, onAdd }) => {

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
    };

    const clearInput = (name) => {
        setFilters(prev => ({ ...prev, [name]: '', page: 1 }));
    };

    return (
        <div className="card mb-4">
            <div className="card-body">
                <div className="row gx-3 gy-3 align-items-end">
                    <div className="col-md-3">
                        <label className="form-label">Nom</label>
                        <div className="input-group">
                            <input type="text" className="form-control" name="name" placeholder="Filtrer par nom..." value={filters.name} onChange={handleInputChange} />
                            {filters.name && <button className="btn btn-outline-secondary" onClick={() => clearInput('name')}>&times;</button>}
                        </div>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Prénom</label>
                        <div className="input-group">
                            <input type="text" className="form-control" name="prenom" placeholder="Filtrer par prénom..." value={filters.prenom} onChange={handleInputChange} />
                            {filters.prenom && <button className="btn btn-outline-secondary" onClick={() => clearInput('prenom')}>&times;</button>}
                        </div>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Email</label>
                        <div className="input-group">
                            <input type="email" className="form-control" name="email" placeholder="Filtrer par email..." value={filters.email} onChange={handleInputChange} />
                            {filters.email && <button className="btn btn-outline-secondary" onClick={() => clearInput('email')}>&times;</button>}
                        </div>
                    </div>
                    <div className="col-md-3 d-grid">
                        <Button variant="primary" onClick={onAdd}>
                            <FaPlus className="me-2" /> Ajouter un Étudiant
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EtudiantFilters;
