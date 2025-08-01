import apiClient from './apiClient'; // Assuming apiClient is in the same folder

/**
 * Fetches a paginated list of students based on filters.
 */
export const fetchEtudiants = async ({ queryKey }) => {
  const [, { name, email, date, prenom, page }] = queryKey;
  try {
    const response = await apiClient.get('/etudiants/paginate', {
      params: {
        nom: name || undefined, // Ensure param name matches backend ('nom' vs 'name')
        prenom: prenom || undefined,
        email: email || undefined,
        date: date || undefined,
        page: page || 1,
        per_page: 10,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw new Error(error.response?.data?.message || 'Erreur lors du chargement des étudiants');
  }
};

/**
 * Fetches full details for a single student, including their courses.
 */
export const fetchEtudiantDetails = async (id) => {
  if (!id) return null;
  try {
    const response = await apiClient.get(`/etudiants/show/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student details:', error);
    throw new Error(error.response?.data?.message || 'Erreur lors du chargement des détails');
  }
};

/**
 * Creates a new student.
 */
export const createEtudiant = async (etudiantData) => {
    try {
        const response = await apiClient.post('/etudiants/store', etudiantData); // Adjust endpoint if needed
        return response.data;
    } catch (error) {
        console.error('Error creating student:', error);
        throw error.response?.data || new Error('Erreur lors de la création de l\'étudiant');
    }
};

/**
 * Updates an existing student.
 */
export const updateEtudiant = async ({ id, ...data }) => {
  try {
    const response = await apiClient.put(`/etudiants/update/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error.response?.data || new Error('Erreur lors de la mise à jour');
  }
};

/**
 * Deletes a student by their ID.
 */
export const deleteEtudiant = async (id) => {
  try {
    const response = await apiClient.delete(`/etudiants/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting student:', error);
    throw new Error(error.response?.data?.message || 'Erreur lors de la suppression');
  }
};

/**
 * Adds a course to a student's enrollments.
 */
export const addCourseToStudent = async ({ etudiantId, coursId }) => {
    try {
        const response = await apiClient.post(`/etudiants/${etudiantId}/add-course`, {
            cours_id: coursId,
        });
        return response.data;
    } catch (error) {
        console.error('Error adding course to student:', error);
        throw new Error(error.response?.data?.message || 'Erreur lors de l\'inscription au cours');
    }
};
