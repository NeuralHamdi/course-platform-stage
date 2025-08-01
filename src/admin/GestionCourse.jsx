import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaLayerGroup, FaPlus } from 'react-icons/fa';
import { Button, Alert, Spinner } from 'react-bootstrap';

// Import API functions
import { fetchCourses, fetchCourseDetails, createCourse, updateCourse, deleteCourse } from '../Api/courseApi';

// Import Components
import CourseFilters from './Course/CourseFilter';
import CourseTable from './Course/CourseTable';
import CoursePagination from './Course/CoursePagination';
import CourseDetailsModal from './Course/CourseDetailsModal';
import CourseUpdateModal from './Course/CourseUpdateModal';
import ModalAddCourse from './Course/ModalAddCourse'; // Assuming you have this component
import axios from 'axios';
import {useAuth} from '../context/AuthContext'
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
    const {token} =useAuth();

    // State for modals
    const [selectedIdForDetails, setSelectedIdForDetails] = useState(null);
    const [courseToEdit, setCourseToEdit] = useState(null);
    const [addModalVisible, setAddModalVisible] = useState(false);

    const queryClient = useQueryClient();

    // Query for the list of courses
    const { data, isLoading, isError, isFetching, error } = useQuery({
        queryKey: ['courses-paginated', filters],
        queryFn: fetchCourses,
        keepPreviousData: true,
    });

    // Query for a single course's details
    const { data: selectedCourse, isFetching: isFetchingDetail } = useQuery({
        queryKey: ['courseDetail', selectedIdForDetails],
        queryFn: () => fetchCourseDetails(selectedIdForDetails),
        enabled: !!selectedIdForDetails,
    });

    // --- MUTATIONS ---
    const useCourseMutation = (mutationFn, successMessage) => {
        return useMutation({
            mutationFn,
            onSuccess: (data) => {
                queryClient.invalidateQueries({ queryKey: ['courses-paginated'] });
                alert(data.message || successMessage);
                // Close any open modals on success
                setCourseToEdit(null);
                setAddModalVisible(false);
            },
            onError: (error) => {
                console.error("Mutation Error:", error);
                const errorMessage = error.message || "Une erreur est survenue.";
                const errorDetails = error.errors ? `\nDetails: ${JSON.stringify(error.errors)}` : '';
                alert(`Échec: ${errorMessage}${errorDetails}`);
            }
        });
    };
    
    const handleDownloadSessionRoster = async (sessionId, sessionTitle) => {
    // ... (This function will have the same axios logic as before) ...
    try {
        const response = await axios({
            // ✨ USE THE NEW ROUTE
            url: `http://mon-projet.test/api/sessions/${sessionId}/roster`,
            method: 'GET',
            responseType: 'blob',
            // ... (headers with auth token) ...
            headers:{
                'Authorization':`Bearer ${token}`
            }
        });
        
        // ... (The rest of the logic to create a link and trigger the download is the same) ...
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `liste-presence-${sessionTitle}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);

    } catch (error) {
        console.error("Session Roster Download Error:", error);
        alert("Échec du téléchargement de la liste pour la session.");
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

    const handleDelete = (courseId, courseTitle) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer le cours "${courseTitle}" ?`)) {
            deleteMutation.mutate(courseId);
        }
    };

    const handleUpdate = (updatedData) => {
        updateMutation.mutate({ id: courseToEdit.id, ...updatedData });
    };
    
    const handleAdd = (newData) => {
        addMutation.mutate(newData);
    };

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="h3 mb-0"><FaLayerGroup className="me-2 text-primary" /> Gestion des Cours</h2>
                        <Button variant="primary" onClick={() => setAddModalVisible(true)}>
                            <FaPlus className="me-2" /> Nouveau Cours
                        </Button>
                    </div>

                    {/* Filters */}
                    <CourseFilters filters={filters} setFilters={setFilters} resetFilters={resetFilters} />

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
    // <<< ADD THIS LINE TO FIX THE ERROR
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
            </div>
        </div>
    );
};

export default CoursePage;
