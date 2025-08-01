import apiClient from './apiClient';

/**
 * Fetches a paginated list of courses based on filters.
 * Now includes enrollment sorting support.
 */
export const fetchCourses = async ({ queryKey }) => {
    const [, { search, moduleId, level, duration, enrollmentSort, page }] = queryKey;
    
    try {
        const response = await apiClient.get('/courses/paginate', {
            params: {
                search: search || undefined,
                module_id: moduleId || undefined,
                level: level || undefined,
                duree_unite: duration || undefined,
                enrollment_sort: enrollmentSort || undefined, // NEW: Add enrollment sorting
                page: page || 1,
                per_page: 10,
            },
        });
        
        return response.data;
    } catch (error) {
        console.error('Error fetching courses:', error);
        throw new Error(error.response?.data?.message || 'Erreur lors du chargement des cours');
    }
};

/**
 * Fetches details for a single course by its ID.
 */
export const fetchCourseDetails = async (id) => {
    if (!id) return null;
    
    try {
        const response = await apiClient.get(`/courses/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching course details:', error);
        throw new Error(error.response?.data?.message || 'Erreur lors du chargement des détails du cours');
    }
};

/**
 * Creates a new course.
 */
export const createCourse = async (courseData) => {
    try {
        const response = await apiClient.post('/courses', courseData);
        return response.data;
    } catch (error) {
        console.error('Error creating course:', error);
        const apiError = error.response?.data;
        if (apiError) {
           throw apiError;
        }
        throw new Error('Erreur inattendue lors de la création du cours.');
    }
};

/**
 * Updates an existing course.
 */
export const updateCourse = async ({ id, ...data }) => {
    try {
        const response = await apiClient.put(`/courses/update/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating course:', error);
        throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du cours');
    }
};

/**
 * Deletes a course by its ID.
 */
export const deleteCourse = async (id) => {
    try {
        const response = await apiClient.delete(`/course/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting course:', error);
        throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du cours');
    }
};