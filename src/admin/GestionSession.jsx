import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaCalendarAlt, FaPlus } from 'react-icons/fa';
import { Button, Alert, Modal } from 'react-bootstrap';
// Import components
import SessionDetailsModal from './Sessions/SessionDetailsModal';
import SessionUpdateModal from './Sessions/SessionUpdateModal';
import SessionAddModal from './Sessions/SessionAddModal';
import SessionFilters from './Sessions/SessionFilters';
import SessionTable from './Sessions/SessionTable';
import SessionPagination from './Sessions/SessionPagination';
// Import API functions
import {
  fetchSessions,
  fetchSessionDetails,
  fetchCourses,
  createSession as addSession,
  updateSession,
  deleteSession
} from '../Api/sessionApi';

const GestionSession = () => {
  // Filter states
  const [search, setSearch] = useState('');
  const [coursId, setCoursId] = useState('');
  const [disponibles, setDisponibles] = useState(false);
  const [page, setPage] = useState(1);
  const [statut, setStatut] = useState('');
  
  // Modal states
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedIdForDetails, setSelectedIdForDetails] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [sessionToEdit, setSessionToEdit] = useState(null);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  
  // Confirmation modal state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  
  // Success/Error messages
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const queryClient = useQueryClient();

  // Query for sessions list with pagination
  const { data, isLoading, isError, isFetching, error } = useQuery({
    queryKey: ['sessions-paginated', { search, coursId, disponibles, statut, page }],
    queryFn: fetchSessions,
    keepPreviousData: true,
    staleTime: 30000,
    onError: (error) => {
      setErrorMessage(error.message);
    }
  });

  // Query for courses
  const { data: coursesData, isLoading: isLoadingCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
    staleTime: 300000,
    onError: (error) => {
      console.error('Error loading courses:', error);
    }
  });

  // Query for session details
  const { data: selectedSession, isFetching: isFetchingDetail } = useQuery({
    queryKey: ['sessionDetail', selectedIdForDetails],
    queryFn: () => fetchSessionDetails(selectedIdForDetails),
    enabled: !!selectedIdForDetails,
    onError: (error) => {
      setErrorMessage(error.message);
    }
  });

  // --- MUTATIONS ---
  // Add mutation
  const addMutation = useMutation({
    mutationFn: addSession,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sessions-paginated'] });
      setSuccessMessage(data.message || 'Session ajoutée avec succès!');
      setErrorMessage('');
      setAddModalVisible(false);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteSession,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sessions-paginated'] });
      setSuccessMessage(data.message || 'Session supprimée avec succès!');
      setErrorMessage('');
      setShowDeleteConfirm(false);
      setSessionToDelete(null);
    },
    onError: (error) => {
      setErrorMessage(error.message);
      setSuccessMessage('');
      setShowDeleteConfirm(false);
      setSessionToDelete(null);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updateSession,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sessions-paginated'] });
      queryClient.invalidateQueries({ queryKey: ['sessionDetail'] });
      setSuccessMessage(data.message || 'Session mise à jour avec succès!');
      setErrorMessage('');
      setUpdateModalVisible(false);
      setSessionToEdit(null);
    },
    onError: (error) => {
      setErrorMessage(error.message);
      setSuccessMessage('');
    }
  });

  // --- HANDLERS ---
  const resetFilters = () => {
    setSearch('');
    setCoursId('');
    setDisponibles(false);
    setPage(1);
    setStatut('');
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSuccessMessage('');
    setErrorMessage('');
  };

  // Add Modal handlers
  const handleShowAddModal = () => setAddModalVisible(true);
  const handleCloseAddModal = () => setAddModalVisible(false);
  const handleAdd = (newData, options) => {
    addMutation.mutate(newData, options);
  };

  // Details Modal handlers
  const handleViewDetails = (sessionId) => {
    setSelectedIdForDetails(sessionId);
    setDetailsModalVisible(true);
  };
  const handleCloseDetailsModal = () => {
    setDetailsModalVisible(false);
    setSelectedIdForDetails(null);
  };

  // Edit Modal handlers
  const handleEdit = (session) => {
    setSessionToEdit(session);
    setUpdateModalVisible(true);
  };
  const handleCloseUpdateModal = () => {
    setUpdateModalVisible(false);
    setSessionToEdit(null);
  };
  const handleUpdate = (updatedData) => {
    updateMutation.mutate({ id: sessionToEdit.id, ...updatedData });
  };

  // Delete handlers
  const handleDeleteRequest = (session) => {
    setSessionToDelete(session);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (sessionToDelete) {
      deleteMutation.mutate(sessionToDelete.id);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setSessionToDelete(null);
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
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h3 mb-0">
              <FaCalendarAlt className="me-2 text-primary" />
              Gestion des Sessions
            </h2>
            <Button variant="primary" onClick={handleShowAddModal}>
              <FaPlus className="me-2" />
              Nouvelle Session
            </Button>
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

          {/* Filters */}
          <SessionFilters
            search={search}
            setSearch={setSearch}
            coursId={coursId}
            setCoursId={setCoursId}
            disponibles={disponibles}
            setDisponibles={setDisponibles}
            statut={statut}
            setStatut={setStatut}

            
            coursesData={coursesData}
            isLoadingCourses={isLoadingCourses}
            resetFilters={resetFilters}
          />

          {/* Loading indicator */}
          {isFetching && (
            <div className="text-muted mb-2">
              <div className="d-flex align-items-center">
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
                Recherche en cours...
              </div>
            </div>
          )}

          {/* Error state */}
          {isError && !errorMessage && (
            <Alert variant="danger">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Erreur lors du chargement des sessions: {error?.message}
            </Alert>
          )}

          {/* Sessions Table */}
          <SessionTable
            data={data}
            isLoading={isLoading}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
            deleteMutation={deleteMutation}
          />

          {/* Pagination */}
          <SessionPagination
            data={data}
            onPageChange={handlePageChange}
          />

          {/* --- MODALS --- */}
          {/* Add Modal */}
          <SessionAddModal
            show={addModalVisible}
            handleClose={handleCloseAddModal}
            onAdd={handleAdd}
            courses={coursesData}
            isLoadingCourses={isLoadingCourses}
            addMutation={addMutation}
          />

          {/* Details Modal */}
          <SessionDetailsModal
            show={detailsModalVisible}
            handleClose={handleCloseDetailsModal}
            data={selectedSession}
            isLoading={isFetchingDetail}
          />

          {/* Update Modal */}
          <SessionUpdateModal
            show={updateModalVisible}
            handleClose={handleCloseUpdateModal}
            session={sessionToEdit}
            onUpdate={handleUpdate}
            updateMutation={updateMutation}
            courses={coursesData?.data}
            isLoadingCourses={isLoadingCourses}
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
                Êtes-vous sûr de vouloir supprimer la session <strong>"{sessionToDelete?.titre}"</strong> ?
              </p>
              <div className="alert alert-warning mb-0">
                <i className="bi bi-info-circle me-2"></i>
                <small>Cette action est irréversible.</small>
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
      </div>
    </div>
  );
};

export default GestionSession;