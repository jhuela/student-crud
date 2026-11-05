const STORAGE_KEY = 'STUDENT_API_URL';

/**
 * Normalizes any backend URL or domain into the full /santos/students endpoint.
 * Handles:
 * - "https://student-backend-xxxx.onrender.com" -> "https://student-backend-xxxx.onrender.com/santos/students"
 * - "https://student-backend-xxxx.onrender.com/santos/students" -> "https://student-backend-xxxx.onrender.com/santos/students"
 * - "student-backend-xxxx.onrender.com" -> "https://student-backend-xxxx.onrender.com/santos/students"
 * - "/santos/students" -> "/santos/students"
 */
export function normalizeEndpoint(url) {
  if (!url || !url.trim()) return '/santos/students';
  let clean = url.trim().replace(/\/+$/, '');
  
  if (!clean.endsWith('/santos/students')) {
    clean = `${clean}/santos/students`;
  }
  
  if (!/^https?:\/\//i.test(clean) && !clean.startsWith('/')) {
    clean = `https://${clean}`;
  }
  return clean;
}

/**
 * Get current effective endpoint (checks localStorage first, then import.meta.env, then proxy fallback)
 */
export function getCurrentApiEndpoint() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved.trim()) {
      return normalizeEndpoint(saved);
    }
  }

  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim()) {
    return normalizeEndpoint(envUrl);
  }

  return '/santos/students';
}

/**
 * Save manual backend URL override to localStorage
 */
export function setCustomApiEndpoint(url) {
  if (typeof window !== 'undefined') {
    if (!url || !url.trim()) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, normalizeEndpoint(url));
    }
  }
}

/**
 * Clear custom backend URL
 */
export function clearCustomApiEndpoint() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Service to interact with the Student CRUD Spring Boot REST API.
 */
export const studentService = {
  getEndpoint() {
    return getCurrentApiEndpoint();
  },

  /**
   * Ping / Test backend connection
   */
  async testConnection(targetUrl) {
    const endpoint = normalizeEndpoint(targetUrl || getCurrentApiEndpoint());
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const res = await fetch(endpoint, {
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      return { ok: res.ok, status: res.status, endpoint };
    } catch (err) {
      clearTimeout(timeout);
      return { ok: false, error: err.message, endpoint };
    }
  },

  /**
   * Fetch all students
   * @returns {Promise<Array>} List of students
   */
  async getAllStudents() {
    const endpoint = getCurrentApiEndpoint();
    const controller = new AbortController();
    // 25s timeout to handle Render free-tier cold starts
    const timeout = setTimeout(() => controller.abort(), 25000);

    try {
      const response = await fetch(endpoint, {
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status} (${response.statusText || 'Error'})`);
      }
      return await response.json();
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === 'AbortError') {
        throw new Error(`Request timed out. If Render backend was asleep, it may take 45-60 seconds to wake up.`);
      }
      throw err;
    }
  },

  /**
   * Fetch a single student by ID
   */
  async getStudentById(id) {
    const endpoint = getCurrentApiEndpoint();
    const response = await fetch(`${endpoint}/${id}`, {
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
   */
  async createStudent(studentData) {
    const endpoint = getCurrentApiEndpoint();
    const response = await fetch(endpoint, {
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
   */
  async updateStudent(id, studentData) {
    const endpoint = getCurrentApiEndpoint();
    const response = await fetch(`${endpoint}/${id}`, {
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
   */
  async deleteStudent(id) {
    const endpoint = getCurrentApiEndpoint();
    const response = await fetch(`${endpoint}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to delete student with ID ${id}`);
    }
    return response.text();
  },
};
