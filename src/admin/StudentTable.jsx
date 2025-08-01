import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert, Spinner } from 'react-bootstrap';

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
import AddEtudiantModal from './etudiant/ADDEtudiantModal'; // Assuming this path
import AddCourseToStudentModal from './etudiant/AddcourseToStudent'; // Assuming this path
 // Reusing pagination component
import CoursePagination from './Course/CoursePagination'; // Assuming this path 
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

    const queryClient = useQueryClient();

    // Query for the list of students
    const { data, isLoading, isError, isFetching, error } = useQuery({
        queryKey: ['etudiants', filters],
        queryFn: fetchEtudiants,
        keepPreviousData: true,
    });

    // Query for a single student's details
    const { data: selectedEtudiant, isFetching: isFetchingDetail } = useQuery({
        queryKey: ['etudiantDetail', modalState.detailsId],
        queryFn: () => fetchEtudiantDetails(modalState.detailsId),
        enabled: !!modalState.detailsId,
    });

    // --- MUTATIONS ---
    const useGenericMutation = (mutationFn, successMessage, queryKeyToInvalidate = 'etudiants') => {
        return useMutation({
            mutationFn,
            onSuccess: (data) => {
                queryClient.invalidateQueries({ queryKey: [queryKeyToInvalidate] });
                alert(data.message || successMessage);
                // Close all modals on success
                setModalState({ detailsId: null, add: false, addCourse: null, edit: null });
            },
            onError: (error) => {
                console.error("Mutation Error:", error);
                alert(`Échec: ${error.message || "Une erreur est survenue."}`);
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

    const handleDelete = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet étudiant?')) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="container-fluid py-4">
            <h2 className="mb-4">Gestion des Étudiants</h2>
            
            <EtudiantFilters 
                filters={filters}
                setFilters={setFilters}
                onAdd={() => setModalState(prev => ({ ...prev, add: true }))}
            />

            {isError && <Alert variant="danger">Erreur: {error.message}</Alert>}
            {isFetching && !isLoading && <div className="text-muted mb-2"><Spinner size="sm" /> Mise à jour...</div>}

            <EtudiantTable
                data={data}
                isLoading={isLoading}
                onViewDetails={(id) => setModalState(prev => ({ ...prev, detailsId: id }))}
                onEdit={(etudiant) => setModalState(prev => ({ ...prev, edit: etudiant }))}
                onDelete={handleDelete}
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
        </div>
    );
};

export default EtudiantsPage;
