/**
 * Resolve the API base endpoint dynamically.
 * Supports:
 * - Local Vite dev proxy: '/santos/students'
 * - Render / Production env var: 'https://<backend-domain>.onrender.com'
 */
function getApiEndpoint() {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim()) {
    let clean = envUrl.trim().replace(/\/+$/, '');
    if (!clean.endsWith('/santos/students')) {
      clean = `${clean}/santos/students`;
    }
    if (!/^https?:\/\//i.test(clean) && !clean.startsWith('/')) {
      clean = `https://${clean}`;
    }
    return clean;
  }
  // Local Vite proxy fallback
  return '/santos/students';
}

const API_BASE_URL = getApiEndpoint();

/**
 * Service to interact with the Student CRUD Spring Boot REST API.
 */
export const studentService = {
  /**
   * Fetch all students
   * @returns {Promise<Array>} List of students
   */
  async getAllStudents() {
    const response = await fetch(API_BASE_URL, {
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch students (Status ${response.status})`);
    }
    return response.json();
  },

  /**
   * Fetch a single student by ID
   * @param {number|string} id 
   * @returns {Promise<Object>}
   */
  async getStudentById(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to fetch student with ID ${id}`);
    }
    return response.json();
  },

  /**
   * Create a new student
   * @param {{ firstname: string, lastname: string, course: string, section: string }} studentData 
   * @returns {Promise<Object>}
   */
  async createStudent(studentData) {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to create student (Status ${response.status})`);
    }
    return response.json();
  },

  /**
   * Update an existing student
   * @param {number|string} id 
   * @param {{ firstname: string, lastname: string, course: string, section: string }} studentData 
   * @returns {Promise<Object>}
   */
  async updateStudent(id, studentData) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to update student with ID ${id}`);
    }
    return response.json();
  },

  /**
   * Delete a student by ID
   * @param {number|string} id 
   * @returns {Promise<string>}
   */
  async deleteStudent(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to delete student with ID ${id}`);
    }
    return response.text();
  },
};
