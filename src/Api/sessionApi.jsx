import apiClient from './apiClient'; // Import the centralized Axios instance

// The getAuthToken, getAuthHeaders, and API_BASE_URL are no longer needed here.

/**
 * Fetches a paginated list of sessions based on filters.
 */
export const fetchSessions = async ({ queryKey }) => {
  const [, { search, coursId, disponibles, page }] = queryKey;
  try {
    const response = await apiClient.get('/sessions', {
      params: { 
        search: search || undefined, 
        cours_id: coursId || undefined, 
        disponibles: disponibles || false, 
        page: page || 1, 
        per_page: 10 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    throw new Error(error.response?.data?.message || 'Erreur lors du chargement des sessions');
  }
};

/**
 * Fetches details for a single session by its ID.
 */
export const fetchSessionDetails = async (id) => {
  if (!id) {
    throw new Error('ID de session manquant');
  }
  try {
    const response = await apiClient.get(`/sessions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching session details:', error);
    throw new Error(error.response?.data?.message || 'Erreur lors du chargement des détails de la session');
  }
};

/**
 * Fetches all courses, typically for a filter dropdown.
 */
export const fetchCourses = async () => {
  try {
    const response = await apiClient.get('/courses');
    // Handle both paginated and non-paginated API responses
    return Array.isArray(response.data) ? response.data : response.data.data || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw new Error(error.response?.data?.message || 'Erreur lors du chargement des cours');
  }
};

/**
 * Updates an existing session.
 */
export const updateSession = async ({ id, ...data }) => {
  if (!id) {
    throw new Error('ID de session manquant');
  }
  try {
    const response = await apiClient.put(`/sessions/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating session:', error);
    throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour de la session');
  }
};

/**
 * Deletes a session by its ID.
 */
export const deleteSession = async (id) => {
  if (!id) {
    throw new Error('ID de session manquant');
  }
  try {
    const response = await apiClient.delete(`/sessions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting session:', error);
    throw new Error(error.response?.data?.message || 'Erreur lors de la suppression de la session');
  }
};

/**
 * Creates a new session.
 */
export const createSession = async (data) => {
  try {
    const response = await apiClient.post('/sessions', data);
    return response.data;
  } catch (error) {
    console.error('Error creating session:', error);
    const apiError = error.response?.data;
    if (apiError && apiError.message) {
        throw new Error(apiError.message);
    }
    throw new Error('Erreur inattendue lors de la création de la session.');
  }
};
