import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../Api/apiClient';
import { Container, Table, Button, Modal, Spinner, Alert, Form } from 'react-bootstrap';
import { FaEye, FaEdit, FaTrash, FaPlus, FaSync } from 'react-icons/fa';

function ModulesPage() {
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(null);
    const [selectedModule, setSelectedModule] = useState(null);

    // --- 1. Data Fetching with Improved Loading States ---
    const { 
        data: modules, 
        isError, 
        error, 
        isLoading, 
        isFetching, 
        isSuccess,
        isPending,
        isRefetching
    } = useQuery({
        queryKey: ['modules'],
        queryFn: async () => {
            try {
                console.log('Fetching modules...');
                const response = await apiClient.get('/modules');
                console.log('API Response:', response.data);
                
                // Gestion plus flexible de la structure de données
                let moduleData = [];
                if (response.data) {
                    if (Array.isArray(response.data)) {
                        moduleData = response.data;
                    } else if (Array.isArray(response.data.data)) {
                        moduleData = response.data.data;
                    } else if (Array.isArray(response.data.modules)) {
                        moduleData = response.data.modules;
                    }
                }
                
                console.log('Processed modules:', moduleData);
                return moduleData;
            } catch (error) {
                console.error('Error fetching modules:', error);
                throw error;
            }
        },
        staleTime: 15 * 60 * 1000, // 15 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
        refetchOnWindowFocus: false,
        refetchOnMount: true, // Changé pour permettre le rechargement
        refetchOnReconnect: true, // Changé pour recharger à la reconnexion
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });

    // --- 2. Data Modification (Mutations) ---
    const addMutation = useMutation({
        mutationFn: (newModule) => apiClient.post('/modules', newModule),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['modules'] });
            handleCloseModal();
        },
        onError: (err) => {
            console.error("Error adding module:", err.response?.data || err.message);
        }
    });

    const editMutation = useMutation({
        mutationFn: (updatedModule) => apiClient.put(`/modules/${updatedModule.id}`, updatedModule),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['modules'] });
            handleCloseModal();
        },
        onError: (err) => {
            console.error("Error editing module:", err.response?.data || err.message);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (moduleId) => apiClient.delete(`/modules/${moduleId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['modules'] });
            handleCloseModal();
        },
    });

    // --- 3. Event Handlers ---
    const handleShowModal = (type, module = null) => {
        setSelectedModule(module);
        setShowModal(type);
    };

    const handleCloseModal = () => {
        setShowModal(null);
        setSelectedModule(null);
    };

    const handleDelete = () => {
        if (selectedModule) {
            deleteMutation.mutate(selectedModule.id);
        }
    };

    const handleAddOrEdit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        const formData = {
            titre: form.titre.value,
            description: form.description.value,
            url_images: form.url_images.value,
        };

        if (selectedModule) {
            editMutation.mutate({ id: selectedModule.id, ...formData });
        } else {
            addMutation.mutate(formData);
        }
    };

    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: ['modules'] });
    };

    const isMutating = addMutation.isPending || editMutation.isPending || deleteMutation.isPending;
    
    // Condition améliorée pour le chargement : affiche le spinner pendant le chargement initial ET les rechargements
    const isLoadingData = isLoading || (isFetching && !modules);
    
    // Condition pour afficher l'erreur : seulement si erreur ET pas en cours de chargement
    const shouldShowError = isError && !isLoadingData;

    // --- Render Logic ---
    
    // Afficher le spinner de chargement principal
    if (isLoadingData) {
        return (
            <Container className="d-flex justify-content-center mt-5">
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">
                        {isLoading ? 'Loading modules...' : 'Refreshing modules...'}
                    </p>
                </div>
            </Container>
        );
    }
    
    // Afficher l'erreur seulement si pas en cours de chargement
    if (shouldShowError) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">
                    <Alert.Heading>Error loading modules</Alert.Heading>
                    <p>{error?.message || 'An unexpected error occurred'}</p>
                    <p>Please check:</p>
                    <ul>
                        <li>Is your API server running?</li>
                        <li>Is the API address in apiClient.js correct?</li>
                        <li>Check browser console for more details</li>
                    </ul>
                    <hr />
                    <div className="d-flex gap-2">
                        <Button 
                            variant="outline-danger" 
                            onClick={handleRefresh}
                            disabled={isFetching}
                        >
                            {isFetching ? (
                                <>
                                    <Spinner as="span" size="sm" className="me-2" />
                                    Retrying...
                                </>
                            ) : (
                                <>
                                    <FaSync className="me-2" />
                                    Retry
                                </>
                            )}
                        </Button>
                    </div>
                </Alert>
            </Container>
        );
    }

    return (
        <Container fluid="lg" className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h2">
                    Manage Modules 
                    {(isFetching && modules) && (
                        <Spinner size="sm" className="ms-2" animation="border" />
                    )}
                </h1>
                <div>
                    <Button 
                        variant="outline-secondary" 
                        className="me-2"
                        onClick={handleRefresh}
                        disabled={isFetching}
                    >
                        {isFetching ? (
                            <>
                                <Spinner as="span" size="sm" className="me-2" />
                                Refreshing...
                            </>
                        ) : (
                            <>
                                <FaSync className="me-2" />
                                Refresh
                            </>
                        )}
                    </Button>
                    <Button variant="primary" onClick={() => handleShowModal('edit')}>
                        <FaPlus className="me-2" /> Add New Module
                    </Button>
                </div>
            </div>

            {/* Indicateur de rechargement en arrière-plan */}
            {isFetching && modules && (
                <Alert variant="info" className="d-flex align-items-center mb-3">
                    <Spinner size="sm" className="me-2" />
                    <span>Updating modules data...</span>
                </Alert>
            )}

            <Table striped bordered hover responsive="sm" className="shadow-sm">
                <thead className="bg-light">
                    <tr>
                        <th>ID</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th className="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Debug info - à supprimer en production */}
                    {process.env.NODE_ENV === 'development' && (
                        <tr>
                            <td colSpan="5" className="bg-light text-muted small">
                                Debug: Found {modules?.length || 0} modules | 
                                Loading: {isLoading.toString()} | 
                                Fetching: {isFetching.toString()} |
                                Error: {isError.toString()}
                            </td>
                        </tr>
                    )}
                    
                    {modules && modules.length > 0 ? (
                        modules.map((module, index) => {
                            // Debug pour voir la structure des données
                            console.log(`Module ${index}:`, module);
                            
                            return (
                                <tr key={module.id || index}>
                                    <td>{module.id || 'N/A'}</td>
                                    <td>
                                        {module.url_images || module.image_url || module.image ? (
                                            <img 
                                                src={module.url_images || module.image_url || module.image} 
                                                alt={module.titre || module.title || module.name || 'Module'} 
                                                style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '4px' }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'block';
                                                }}
                                            />
                                        ) : null}
                                        <em style={{ display: module.url_images || module.image_url || module.image ? 'none' : 'block' }}>
                                            No image
                                        </em>
                                    </td>
                                    <td>{module.titre || module.title || module.name || 'Unnamed'}</td>
                                    <td>
                                        {(module.description && module.description.trim()) ? (
                                            module.description.length > 80 
                                                ? `${module.description.substring(0, 80)}...`
                                                : module.description
                                        ) : (
                                            <em>No description</em>
                                        )}
                                    </td>
                                    <td className="text-center">
                                        <Button variant="link" className="text-info me-2 p-0" onClick={() => handleShowModal('view', module)} title="View Details">
                                            <FaEye size={20} />
                                        </Button>
                                        <Button variant="link" className="text-warning me-2 p-0" onClick={() => handleShowModal('edit', module)} title="Edit Module">
                                            <FaEdit size={20} />
                                        </Button>
                                        <Button variant="link" className="text-danger p-0" onClick={() => handleShowModal('delete', module)} title="Delete Module">
                                            <FaTrash size={20} />
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center text-muted py-4">
                                No modules found
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* View Modal */}
            <Modal show={showModal === 'view'} onHide={handleCloseModal} centered>
                <Modal.Header closeButton><Modal.Title><FaEye className="me-2" /> Module Details</Modal.Title></Modal.Header>
                <Modal.Body>
                    {selectedModule?.url_images && <img src={selectedModule.url_images} alt={selectedModule.titre} className="img-fluid rounded mb-3" />}
                    <h4>{selectedModule?.titre}</h4>
                    <p><strong>ID:</strong> {selectedModule?.id}</p>
                    <p><strong>Description:</strong></p>
                    <p>{selectedModule?.description || <em>No description provided.</em>}</p>
                </Modal.Body>
                <Modal.Footer><Button variant="secondary" onClick={handleCloseModal}>Close</Button></Modal.Footer>
            </Modal>

            {/* Delete Modal */}
            <Modal show={showModal === 'delete'} onHide={handleCloseModal} centered>
                <Modal.Header closeButton><Modal.Title className="text-danger"><FaTrash className="me-2" /> Confirm Deletion</Modal.Title></Modal.Header>
                <Modal.Body>Are you sure you want to delete "<strong>{selectedModule?.titre}</strong>"?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal} disabled={deleteMutation.isPending}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete} disabled={deleteMutation.isPending}>
                        {deleteMutation.isPending ? <Spinner as="span" size="sm" /> : 'Delete'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Add/Edit Modal */}
            <Modal show={showModal === 'edit'} onHide={handleCloseModal} centered>
                <Form onSubmit={handleAddOrEdit}>
                    <Modal.Header closeButton><Modal.Title>{selectedModule ? <><FaEdit /> Edit</> : <><FaPlus /> Add</>} Module</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="titre">
                            <Form.Label>Module Name</Form.Label>
                            <Form.Control type="text" defaultValue={selectedModule?.titre} required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={4} defaultValue={selectedModule?.description} required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="url_images">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control type="text" defaultValue={selectedModule?.url_images} required />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal} disabled={isMutating}>Cancel</Button>
                        <Button variant="primary" type="submit" disabled={isMutating}>
                            {isMutating ? <Spinner as="span" size="sm" /> : "Save"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}

export default ModulesPage;