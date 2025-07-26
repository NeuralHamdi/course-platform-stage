import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FaEye, FaPen, FaTrash } from 'react-icons/fa';
import { Modal, Button, ListGroup, Form } from 'react-bootstrap';

import AddEtudiantModal from './ADDEtudiantModal';
import AddCourseToStudentModal from './AddcourseToStudent';




// --- COMPOSANT MODAL POUR LES DÉTAILS (INCHANGÉ) ---
const EtudiantDetailsModal = ({ show, handleClose, data, isLoading }) => {
  const etudiantData = data?.etudiant;
  const coursData = data?.cours;

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Détails de l'étudiant</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <p>🔄 Chargement des détails...</p>
        ) : etudiantData ? (
          <>
            <h5>Informations Personnelles</h5>
            <p><strong>Nom:</strong> {etudiantData.nom} {etudiantData.prenom}</p>
            <p><strong>Email:</strong> {etudiantData.email}</p>
            <p><strong>Date d'inscription:</strong> {new Date(etudiantData.date_inscription).toLocaleDateString()}</p>
            <p><strong>Niveau d'études:</strong> {etudiantData.niveau_Etudes}</p>
            <p><strong>Profession:</strong> {etudiantData.profession}</p>
            <hr />
            <h5>Cours Inscrits</h5>
            {coursData && coursData.length > 0 ? (
              <ListGroup>
                {coursData.map(cours => (
                  <ListGroup.Item key={cours.id}>{cours.titre}</ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p>Cet étudiant n'est inscrit à aucun cours.</p>
            )}
          </>
        ) : (
          <p className="text-danger">Impossible de charger les détails de l'étudiant.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Fermer</Button>
      </Modal.Footer>
    </Modal>
  );
};


// MODAL DE MISE À JOUR ---
const EtudiantUpdateModal = ({ show, handleClose, etudiant, onUpdate,updateMutation }) => {
    // State pour gérer les champs du formulaire
    const [formData, setFormData] = useState({});
    
    // `useEffect` pour pré-remplir le formulaire quand un étudiant est sélectionné
    useEffect(() => {
        if (etudiant) {
            setFormData({
                nom: etudiant.nom || '',
                prenom: etudiant.prenom || '',
                email: etudiant.email || '',
                niveau_Etudes: etudiant.niveau_Etudes || '',
                profession: etudiant.profession || '',
                password:'',
                password_confirmation:''
            });
        }
    }, [etudiant]);

    // Gérer les changements dans les inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Soumettre le formulaire
    const handleSubmit = (e) => {
      e.preventDefault();

        // NOUVEAU: Vérifier que les mots de passe correspondent s'ils sont saisis
        if (formData.password && formData.password !== formData.password_confirmation) {
            alert("La confirmation du mot de passe ne correspond pas !");
            return; // Arrêter la soumission
        }
        
        // On prépare les données à envoyer
        const dataToUpdate = { ...formData };

        // Si le champ mot de passe est vide, on le retire de l'objet pour ne pas l'envoyer
        if (!dataToUpdate.password) {
            delete dataToUpdate.password;
        }

        // On retire toujours la confirmation, le backend n'en a pas besoin
        delete dataToUpdate.password_confirmation;

        onUpdate(dataToUpdate); // Appelle la fonction de mise à jour passée en props
    };

    if (!etudiant) return null; // Ne rien afficher si aucun étudiant n'est sélectionné

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Modifier l'étudiant</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Nom</Form.Label>
                        <Form.Control type="text" name="nom" value={formData.nom} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Prénom</Form.Label>
                        <Form.Control type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Niveau d'études</Form.Label>
                        <Form.Control type="text" name="niveau_Etudes" value={formData.niveau_Etudes} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Profession</Form.Label>
                        <Form.Control type="text" name="profession" value={formData.profession} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>password</Form.Label>
                        <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} placeholder='nouveau password' />
                    </Form.Group>
                     <Form.Group className="mb-3">
                        <Form.Label>confirmation de password</Form.Label>
                        <Form.Control type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange}  placeholder='password'/>
                    </Form.Group>
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

// Fetch all students (inchangé)
const fetchEtudiants = async ({ queryKey }) => {
  const [, { name, email, date, page, prenom }] = queryKey;
  const token = localStorage.getItem('token');
  const response = await axios.get('http://mon-projet.test/api/etudiants/paginate', {
    headers: { Authorization: `Bearer ${token}` },
    params: { name, email, prenom, date, page, per_page: 10 },
  });
  return response.data;
};

// Fetch a single student's full details (inchangé)
const fetchEtudiantDetails = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`http://mon-projet.test/api/etudiants/show/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// NOUVELLE FONCTION: Mettre à jour un étudiant
const updateEtudiant = async ({ id, ...data }) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`http://mon-projet.test/api/etudiants/update/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};


// Delete a student (inchangé)
const deleteEtudiant = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`http://mon-projet.test/api/etudiants/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


// --- COMPOSANT PRINCIPAL : StudentTable ---
const StudentTable = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [page, setPage] = useState(1);
  const [prenom, setPrenom] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  
  // State pour le modal de détails
  const [selectedIdForDetails, setSelectedIdForDetails] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  // NOUVEAU STATE: pour le modal de mise à jour
  const [etudiantToEdit, setEtudiantToEdit] = useState(null);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);

  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
const [selectedEtudiantId, setSelectedEtudiantId] = useState(null);


  const queryClient = useQueryClient();

  // Query pour la liste des étudiants (inchangé)
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['etudiants', { name, email, date, page, prenom }],
    queryFn: fetchEtudiants,
    keepPreviousData: true,
  });

  // Query pour les détails d'un étudiant (inchangé)
  const { data: selectedEtudiant, isFetching: isFetchingDetail } = useQuery({
    queryKey: ['etudiantDetail', selectedIdForDetails],
    queryFn: () => fetchEtudiantDetails(selectedIdForDetails),
    enabled: !!selectedIdForDetails,
  });

  // Mutation pour la suppression (inchangé)
  const deleteMutation = useMutation({
    mutationFn: deleteEtudiant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['etudiants'] });
      alert('Étudiant supprimé avec succès!');
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression:', error);
      alert("Échec de la suppression de l'étudiant.");
    },
  });

  //  MUTATION: pour la mise à jour
  const updateMutation = useMutation({
      mutationFn: updateEtudiant,
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['etudiants'] });
          alert('Étudiant mis à jour avec succès!');
          setUpdateModalVisible(false); // Fermer le modal après succès
          setEtudiantToEdit(null); // Réinitialiser l'état
      },
      onError: (error) => {
          console.error("Erreur lors de la mise à jour:", error);
          alert(`Échec de la mise à jour: ${error.response?.data?.message || error.message}`);
      }
  });

  // Handlers pour les filtres (inchangés)
  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleDateChange = (e) => setDate(e.target.value);
  const handlePageChange = (newPage) => setPage(newPage);
  const handlePrenomChange = (e) => setPrenom(e.target.value);
  const clearName = () => setName('');
  const clearPrenom = () => setPrenom('');
  const clearEmail = () => setEmail('');
  const clearDate = () => setDate('');

  // Handler pour la suppression (inchangé)
  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet étudiant?')) {
      deleteMutation.mutate(id);
    }
  };
  
  // NOUVEAU HANDLER: pour ouvrir le modal de mise à jour
  const handleOpenUpdateModal = (etudiant) => {
      setEtudiantToEdit(etudiant);
      setUpdateModalVisible(true);
  };

  // NOUVEAU HANDLER: pour soumettre la mise à jour
  const handleUpdate = (updatedData) => {
      updateMutation.mutate({ id: etudiantToEdit.id, ...updatedData });
  };


  return (
    <div className="container mt-4">
      <h2 className="mb-4">Liste des étudiants</h2>

        {/* Filters */}
        <div className="mb-3">
          <div className="row gx-2 gy-2 align-items-end">
            {/* Nom */}
            <div className="col-12 col-sm-6 col-md-4">
              <div className="input-group">
                <input type="text" className="form-control" placeholder="nom" value={name} onChange={handleNameChange} />
                {name && (<button className="btn btn-outline-secondary" onClick={clearName}>&times;</button>)}
              </div>
            </div>
            {/* Prénom */}
            <div className="col-12 col-sm-6 col-md-4">
              <div className="input-group">
                <input type="text" className="form-control" placeholder="prénom" value={prenom} onChange={handlePrenomChange} />
                {prenom && (<button className="btn btn-outline-secondary" onClick={clearPrenom}>&times;</button>)}
              </div>
            </div>
            {/* Email */}
            <div className="col-12 col-sm-6 col-md-4">
              <div className="input-group">
                <input type="text" className="form-control" placeholder="Email" value={email} onChange={handleEmailChange} />
                {email && (<button className="btn btn-outline-secondary" onClick={clearEmail}>&times;</button>)}
              </div>
            </div>
            {/* Date */}
            <div className="col-12 col-sm-12 col-md-4">
              <div className="input-group">
                <input type="date" className="form-control" value={date} onChange={handleDateChange} />
                {date && (<button className="btn btn-outline-secondary" onClick={clearDate}>&times;</button>)}
              </div>
            </div>
            {/* Button */}
            <div className="col-12 col-md-4 d-grid">
              <Button onClick={() => setShowAddModal(true)}>Ajouter un étudiant</Button>
            </div>
          </div>
          <AddEtudiantModal show={showAddModal} handleClose={() => setShowAddModal(false)} />
        </div>
        {/* Loading and error states */}
      {isFetching && <div className="text-muted mb-2">🔄 Recherche en cours...</div>}
      {isError && <div className="text-danger">Erreur lors du chargement.</div>}
      {isLoading && <div>Chargement initial...</div>}
      {deleteMutation.isLoading && <div className="text-info">Suppression en cours...</div>}
      {updateMutation.isLoading && <div className="text-info">Mise à jour en cours...</div>}


      {/* Student Table */}
      {!isLoading && (
        <>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>#ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Registration Date</th>
                  <th>Education Level</th>
                  <th>Profession</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((etudiant) => (
                  <tr key={etudiant.id}>
                    <td>{etudiant.id}</td>
                    <td>{etudiant.nom} {etudiant.prenom}</td>
                    <td>{etudiant.email}</td>
                    <td>{new Date(etudiant.date_inscription).toLocaleDateString()}</td>
                    <td>{etudiant.niveau_Etudes}</td>
                    <td>{etudiant.profession}</td>
                    <td>
                      <FaEye
                        className="me-2 text-info"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setSelectedIdForDetails(etudiant.id);
                          setDetailsModalVisible(true);
                        }}
                      />
                      {/* Le bouton FaPen est maintenant fonctionnel */}
                      <FaPen
                        className="me-2 text-warning"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleOpenUpdateModal(etudiant)}
                      />
                      <FaTrash
                        className="text-danger"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleDelete(etudiant.id)}
                        disabled={deleteMutation.isLoading}
                      />
                       <Button
    variant="success"
    size="sm"
    onClick={() => {
      setSelectedEtudiantId(etudiant.id);
      setShowAddCourseModal(true);
    }}
  >
    + Cours
  </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <nav>
            <ul className="pagination justify-content-center mt-3">
              {data?.links?.map((link, index) => (
                <li key={index} className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => {
                      if (link.url) {
                        const urlParams = new URLSearchParams(link.url.split('?')[1]);
                        const pageNum = parseInt(urlParams.get('page')) || 1;
                        handlePageChange(pageNum);
                      }
                    }}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}

      {/* Modal pour les détails */}
      <EtudiantDetailsModal
        show={detailsModalVisible}
        handleClose={() => {
          setDetailsModalVisible(false);
          setSelectedIdForDetails(null);
        }}
        data={selectedEtudiant}
        isLoading={isFetchingDetail}
      />

      {/*Modal pour la mise à jour */}
      <EtudiantUpdateModal
        show={updateModalVisible}
        handleClose={() => {
            setUpdateModalVisible(false);
            setEtudiantToEdit(null);
        }}
        etudiant={etudiantToEdit}
        onUpdate={handleUpdate}
        updateMutation={updateMutation} 
      />
      <AddCourseToStudentModal
  show={showAddCourseModal}
  handleClose={() => setShowAddCourseModal(false)}
  etudiantId={selectedEtudiantId}
  refetchEtudiantDetails={() => queryClient.invalidateQueries(['etudiants'])}
/>


    </div>
  );
};

export default StudentTable;
