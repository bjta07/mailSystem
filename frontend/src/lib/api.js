

const API_HOST = process.env.API_HOST || 'http://localhost:4000';

// Función base para hacer peticiones HTTP
async function fetchApi(url, options = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
    };

    const apiUrl = `${API_HOST}/api/${url}`.replace(/([^:]\/)\/+/g, "$1");

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };

    try {
        const response = await fetch(apiUrl, config);
        const data = await response.json();

        if (!response.ok) {
            const errorMsg = data.error || data.message || 'Error en la solicitud';
            console.error(`❌ API error ${response.status}: ${errorMsg}`);
            throw new Error(errorMsg);
        }

        return data;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Funciones de autenticación
export const authApi = {
    login: (credentials) => fetchApi('users/login', {
        method: 'POST',
        headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(credentials)
    }),

    register: (userData) => fetchApi('auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
        credentials: 'include'
    }),

    getProfile: () => fetchApi('users/profile', {
        credentials: 'include'
    })
};

// Funciones de administración de usuarios
export const userApi = {
    getAllUsers: () => fetchApi('users'),

    updateUserRole: (userId, role) => fetchApi(`users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role })
    }),

    updateUserStatus: (userId, status) => fetchApi(`users/${userId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
    }),

    deleteUser: (userId) => fetchApi(`users/${userId}`, {
        method: 'DELETE'
    })
};
