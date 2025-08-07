import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert, Spinner, Modal, Button } from 'react-bootstrap';

// API Functions
import { 
    fetchEtudiants, 
    fetchEtudiantDetails, 
    createEtudiant, 
    updateEtudiant, 
    deleteEtudiant 
} from '../Api/etudiantApi';

// Components
import EtudiantFilters from './etudiant/EtudiantsFilters';
import EtudiantTable from './etudiant/EtudiantsTable';
import { EtudiantDetailsModal, EtudiantUpdateModal } from './etudiant/EtudiantModals';
import AddEtudiantModal from './etudiant/ADDEtudiantModal';
import AddCourseToStudentModal from './etudiant/AddcourseToStudent';
import CoursePagination from './Course/CoursePagination';

const EtudiantsPage = () => {
    // State for filters and pagination
    const [filters, setFilters] = useState({
        name: '',
        prenom: '',
        email: '',
        date: '',
        page: 1,
    });

    // State for modals
    const [modalState, setModalState] = useState({
        detailsId: null,
        add: false,
        addCourse: null, // will hold student ID
        edit: null, // will hold student object
    });

    // Delete confirmation modal state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [etudiantToDelete, setEtudiantToDelete] = useState(null);

    // Success/Error messages
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const queryClient = useQueryClient();

    // Query for the list of students
    const { data, isLoading, isError, isFetching, error } = useQuery({
        queryKey: ['etudiants', filters],
        queryFn: fetchEtudiants,
        keepPreviousData: true,
        onError: (error) => {
            setErrorMessage(error.message);
        }
    });

    // Query for a single student's details
    const { data: selectedEtudiant, isFetching: isFetchingDetail } = useQuery({
        queryKey: ['etudiantDetail', modalState.detailsId],
        queryFn: () => fetchEtudiantDetails(modalState.detailsId),
        enabled: !!modalState.detailsId,
        onError: (error) => {
            setErrorMessage(error.message);
        }
    });

    // --- MUTATIONS ---
    const useGenericMutation = (mutationFn, successMsg, queryKeyToInvalidate = 'etudiants') => {
        return useMutation({
            mutationFn,
            onSuccess: (data) => {
                queryClient.invalidateQueries({ queryKey: [queryKeyToInvalidate] });
                setSuccessMessage(data.message || successMsg);
                setErrorMessage('');
                // Close all modals on success
                setModalState({ detailsId: null, add: false, addCourse: null, edit: null });
                setShowDeleteConfirm(false);
                setEtudiantToDelete(null);
            },
            onError: (error) => {
                console.error("Mutation Error:", error);
                setErrorMessage(`Échec: ${error.message || "Une erreur est survenue."}`);
                setSuccessMessage('');
                setShowDeleteConfirm(false);
                setEtudiantToDelete(null);
            }
        });
    };

    const addMutation = useGenericMutation(createEtudiant, 'Étudiant ajouté avec succès!');
    const updateMutation = useGenericMutation(updateEtudiant, 'Étudiant mis à jour avec succès!');
    const deleteMutation = useGenericMutation(deleteEtudiant, 'Étudiant supprimé avec succès!');

    // --- HANDLERS ---
    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const handleDeleteRequest = (etudiant) => {
        setEtudiantToDelete(etudiant);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = () => {
        if (etudiantToDelete) {
            deleteMutation.mutate(etudiantToDelete);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirm(false);
        setEtudiantToDelete(null);
    };

    // Clear success/error messages after a delay
    React.useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    React.useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(''), 8000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h3 mb-0">
                    <i className="bi bi-people-fill me-2 text-primary"></i>
                    Gestion des Étudiants
                </h2>
            </div>
            
            {/* Success/Error Messages */}
            {successMessage && (
                <Alert variant="success" dismissible onClose={() => setSuccessMessage('')}>
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {successMessage}
                </Alert>
            )}
            
            {errorMessage && (
                <Alert variant="danger" dismissible onClose={() => setErrorMessage('')}>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {errorMessage}
                </Alert>
            )}
            
            <EtudiantFilters 
                filters={filters}
                setFilters={setFilters}
                onAdd={() => setModalState(prev => ({ ...prev, add: true }))}
            />

            {/* Loading indicator for updates */}
            {isFetching && !isLoading && (
                <div className="text-muted mb-2">
                    <div className="d-flex align-items-center">
                        <Spinner size="sm" className="me-2" />
                        Mise à jour...
                    </div>
                </div>
            )}

            {/* Error state (fallback if not handled by errorMessage state) */}
            {isError && !errorMessage && (
                <Alert variant="danger">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    Erreur: {error?.message}
                </Alert>
            )}

            <EtudiantTable
                data={data}
                isLoading={isLoading}
                onViewDetails={(id) => setModalState(prev => ({ ...prev, detailsId: id }))}
                onEdit={(etudiant) => setModalState(prev => ({ ...prev, edit: etudiant }))}
                onDelete={handleDeleteRequest}
                onAddCourse={(id) => setModalState(prev => ({ ...prev, addCourse: id }))}
                deleteMutation={deleteMutation}
            />
            
            <CoursePagination data={data} onPageChange={handlePageChange} />

            {/* --- MODALS --- */}
            <EtudiantDetailsModal
                show={!!modalState.detailsId}
                handleClose={() => setModalState(prev => ({ ...prev, detailsId: null }))}
                data={selectedEtudiant}
                isLoading={isFetchingDetail}
            />
            <EtudiantUpdateModal
                show={!!modalState.edit}
                handleClose={() => setModalState(prev => ({ ...prev, edit: null }))}
                etudiant={modalState.edit}
                onUpdate={(updatedData) => updateMutation.mutate({ id: modalState.edit.id, ...updatedData })}
                updateMutation={updateMutation}
            />
            <AddEtudiantModal
                show={modalState.add}
                handleClose={() => setModalState(prev => ({ ...prev, add: false }))}
                addMutation={addMutation}
            />
            <AddCourseToStudentModal
                show={!!modalState.addCourse}
                handleClose={() => setModalState(prev => ({ ...prev, addCourse: null }))}
                etudiantId={modalState.addCourse}
                refetchEtudiantDetails={() => queryClient.invalidateQueries({ queryKey: ['etudiantDetail', modalState.addCourse]})}
            />

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteConfirm} onHide={handleDeleteCancel} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="text-danger">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        Confirmer la suppression
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-2">
                    <p className="mb-2">
                        Êtes-vous sûr de vouloir supprimer l'étudiant <strong>
                        {etudiantToDelete?.nom} {etudiantToDelete?.prenom}
                        </strong> ?
                    </p>
                    <div className="alert alert-warning mb-0">
                        <i className="bi bi-info-circle me-2"></i>
                        <small>Cette action est irréversible et supprimera toutes les données associées à cet étudiant.</small>
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="secondary" onClick={handleDeleteCancel}>
                        <i className="bi bi-x-circle me-1"></i>
                        Annuler
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleDeleteConfirm}
                        disabled={deleteMutation.isLoading}
                    >
                        {deleteMutation.isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Suppression...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-trash me-1"></i>
                                Supprimer
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default EtudiantsPage;