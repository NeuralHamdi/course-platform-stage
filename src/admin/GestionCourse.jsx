import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaLayerGroup, FaPlus } from 'react-icons/fa';
import { Button, Alert, Spinner } from 'react-bootstrap';
// --- NEW IMPORTS for styled alerts and confirmations ---
import { ToastContainer, toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
// Import API functions
import { fetchCourses, fetchCourseDetails, createCourse, updateCourse, deleteCourse } from '../Api/courseApi';
import apiClient from '../Api/apiClient';
// Import Components
import CourseFilters from './Course/CourseFilter';
import CourseTable from './Course/CourseTable';
import CoursePagination from './Course/CoursePagination';
import CourseDetailsModal from './Course/CourseDetailsModal';
import CourseUpdateModal from './Course/CourseUpdateModal';
import ModalAddCourse from './Course/ModalAddCourse';
import axios from 'axios';
import {useAuth} from '../context/AuthContext';

const CoursePage = () => {
    // State for filters and pagination
    const [filters, setFilters] = useState({
        search: '',
        level: '',
        duration: '',
        moduleId: '',
        enrollmentSort:'',
        page: 1,
    });
    const {token} = useAuth();
      const fetchModules = async () => {
        const response = await apiClient.get("/modules/all");
        return response.data;
    };

    const { data: modules = [], isLoading: isLoadingModules } = useQuery({
        queryKey: ['modules'],
        queryFn: fetchModules,
    });
    // State for modals
    const [selectedIdForDetails, setSelectedIdForDetails] = useState(null);
    const [courseToEdit, setCourseToEdit] = useState(null);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const queryClient = useQueryClient();
    
    // Query for the list of courses
    const { data, isLoading, isError, isFetching, error } = useQuery({
        queryKey: ['courses-paginated', filters],
        queryFn: fetchCourses, // Pass filters to the fetch function
        keepPreviousData: true,
    });
    
    // Query for a single course's details
    const { data: selectedCourse, isFetching: isFetchingDetail } = useQuery({
        queryKey: ['courseDetail', selectedIdForDetails],
        queryFn: () => fetchCourseDetails(selectedIdForDetails),
        enabled: !!selectedIdForDetails,
    });
    
    // --- MUTATIONS ---
    // --- MODIFIED: Reusable mutation hook now uses react-toastify for success feedback ---
    const useCourseMutation = (mutationFn, successMessage) => {
        return useMutation({
            mutationFn,
            onSuccess: (data) => {
                queryClient.invalidateQueries({ queryKey: ['courses-paginated'] });
                // Use toast for a clean, non-blocking notification
                toast.success(data.message || successMessage);
                // Close any open modals on success
                setCourseToEdit(null);
                setAddModalVisible(false);
            },
            onError: (error) => {
                console.error("Mutation Error:", error);
                const errorMessage = error.message || "Une erreur est survenue.";
                // Use toast for error messages as well for consistency
                toast.error(`Échec: ${errorMessage}`);
            }
        });
    };
    
    const handleDownloadSessionRoster = async (sessionId, sessionTitle) => {
        try {
            const response = await apiClient.get(`/sessions/${sessionId}/roster`, {
                responseType: 'blob',
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `liste-presence-${sessionTitle}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Session Roster Download Error:", error);
            toast.error("Échec du téléchargement de la liste pour la session.");
        }
    };
    
    const addMutation = useCourseMutation(createCourse, 'Cours ajouté avec succès!');
    const updateMutation = useCourseMutation(updateCourse, 'Cours mis à jour avec succès!');
    const deleteMutation = useCourseMutation(deleteCourse, 'Cours supprimé avec succès!');
    
    // --- HANDLERS ---
    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };
    
    const resetFilters = () => {
        setFilters({ search: '', level: '', duration: '', moduleId: '', enrollmentSort:'', page: 1 });
    };
    
    // --- MODIFIED: handleDelete now uses a styled confirmation dialog ---
    const handleDelete = (courseId, courseTitle) => {
        confirmAlert({
            title: 'Confirmation de suppression',
            message: `Êtes-vous sûr de vouloir supprimer le cours "${courseTitle}" ? Cette action est irréversible.`,
            buttons: [
                {
                    label: 'Oui, supprimer',
                    className: 'btn btn-danger', // Apply bootstrap class
                    onClick: () => deleteMutation.mutate(courseId)
                },
                {
                    label: 'Non, annuler',
                    className: 'btn btn-secondary' // Apply bootstrap class
                }
            ],
             // This provides a smoother experience
            closeOnClickOutside: true,
        });
    };
    
    const handleUpdate = (updatedData) => {
        updateMutation.mutate({ id: courseToEdit.id, ...updatedData });
    };
    
    const handleAdd = (newData) => {
        addMutation.mutate(newData);
    };
    
    return (
        <div className="container-fluid">
            {/* --- ADDED: ToastContainer for displaying all notifications --- */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h3 mb-0"><FaLayerGroup className="me-2 text-primary" /> Gestion des Cours</h2>
                <Button variant="primary" onClick={() => setAddModalVisible(true)}>
                    <FaPlus className="me-2" /> Nouveau Cours
                </Button>
            </div>
            
            {/* Filters */}
            <CourseFilters filters={filters} setFilters={setFilters} resetFilters={resetFilters}  modules={modules} isLoadingModules={isLoadingModules} />
            
            {/* Loading/Error States */}
            {isFetching && !isLoading && <div className="text-muted mb-2"><Spinner size="sm" /> Recherche en cours...</div>}
            {isError && <Alert variant="danger">Erreur: {error.message}</Alert>}
            
            {/* Table and Pagination */}
            {isLoading ? (
                <div className="text-center p-5"><Spinner animation="border" /></div>
            ) : (
                <>
                    <CourseTable
                        data={data}
                        onViewDetails={setSelectedIdForDetails}
                        onEdit={setCourseToEdit}
                        onDelete={handleDelete}
                        deleteMutation={deleteMutation}
                    />
                    <CoursePagination data={data} onPageChange={handlePageChange} />
                </>
            )}
            
            {/* Modals */}
            <CourseDetailsModal
                show={!!selectedIdForDetails}
                handleClose={() => setSelectedIdForDetails(null)}
                data={selectedCourse}
                isLoading={isFetchingDetail}
                onDownloadRoster={handleDownloadSessionRoster}
            />
            <CourseUpdateModal
                show={!!courseToEdit}
                handleClose={() => setCourseToEdit(null)}
                course={courseToEdit}
                onUpdate={handleUpdate}
                updateMutation={updateMutation}
            />
            <ModalAddCourse 
                show={addModalVisible} 
                handleClose={() => setAddModalVisible(false)}
                onAdd={handleAdd}
                addMutation={addMutation}
            />
        </div>
    );
};

export default CoursePage;