import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from './apiClient'; // Make sure this points to the correct API address
import { Container, Table, Button, Modal, Spinner, Alert, Form } from 'react-bootstrap';
import { FaEye, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

function ModulesPage() {
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(null);
    const [selectedModule, setSelectedModule] = useState(null);

    // --- 1. Data Fetching ---
    const { data: modules, isError, error, isLoading } = useQuery({
        queryKey: ['modules'],
        queryFn: async () => {
            const response = await apiClient.get('/modules');
            return response.data.data;
        },
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

    // ✨ FIX: This function now correctly gathers all fields with the right names
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

    const isMutating = addMutation.isPending || editMutation.isPending || deleteMutation.isPending;

    // --- Render Logic ---
    if (isLoading) return <Container className="d-flex justify-content-center mt-5"><Spinner animation="border" /></Container>;
    if (isError) return <Container className="mt-4"><Alert variant="danger">Error: {error.message}. Is your API server running and is the address in apiClient.js correct?</Alert></Container>;

    return (
        <Container fluid="lg" className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h2">Manage Modules</h1>
                <Button variant="primary" onClick={() => handleShowModal('edit')}>
                    <FaPlus className="me-2" /> Add New Module
                </Button>
            </div>

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
                    {modules?.map(module => (
                        <tr key={module.id}>
                            <td>{module.id}</td>
                            <td>
                                {module.url_images ? (
                                    <img src={module.url_images} alt={module.titre} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '4px' }} />
                                ) : (
                                    <em>No image</em>
                                )}
                            </td>
                            <td>{module.titre}</td>
                            <td>
                                {module.description ? `${module.description.substring(0, 80)}${module.description.length > 80 ? '...' : ''}` : <em>No description</em>}
                            </td>
                            <td className="text-center">
                                <Button variant="link" className="text-info me-2 p-0" onClick={() => handleShowModal('view', module)} title="View Details"><FaEye size={20} /></Button>
                                <Button variant="link" className="text-warning me-2 p-0" onClick={() => handleShowModal('edit', module)} title="Edit Module"><FaEdit size={20} /></Button>
                                <Button variant="link" className="text-danger p-0" onClick={() => handleShowModal('delete', module)} title="Delete Module"><FaTrash size={20} /></Button>
                            </td>
                        </tr>
                    ))}
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
                        {/* ✨ FIX: The controlId is now unique and correct */}
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