const API_HOST = process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:4000';

async function fetchApi(url, options = {}) {
    if (!API_HOST) {
        throw new Error('API_HOST no está definido');
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
    };

    const apiUrl = `${API_HOST}/api/${url}`.replace(/([^:]\/)\/+/g, "$1");
    console.log('🚀 Fetching:', apiUrl); // Para debugging

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };

    try {
        const response = await fetch(apiUrl, config);
        
        // Si la respuesta no es JSON, capturar el error
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Respuesta no-JSON:', text);
            throw new Error('El servidor no respondió con JSON válido');
        }

        const data = await response.json();

        if (!response.ok) {
            const errorMsg = data.error || data.message || 'Error en la solicitud';
            console.error('Error de API:', errorMsg);
            throw new Error(errorMsg);
        }

        return data;
    } catch (error) {
        console.error('Error en fetchApi:', error);
        throw error;
    }
}

export const authApi = {
    login: (credentials) => fetchApi('users/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),

    register: (userData) => fetchApi('users/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),

    getProfile: () => fetchApi('users/profile'),

    refreshToken: () => fetchApi('auth/refresh', {
        method: 'POST'
    }),
    findAll: async () => {
        console.log('Llamando a findAll API...');
        try {
            const response = await fetchApi('users');
            console.log('Respuesta de findAll:', response);
            
            // Asegurarse de que devolvemos un array
            if (response && response.data) {
                return {
                    ok: true,
                    data: Array.isArray(response.data) ? response.data : [response.data]
                };
            }
            
            // Si la respuesta es un array directamente
            if (Array.isArray(response)) {
                return {
                    ok: true,
                    data: response
                };
            }
            
            throw new Error('Formato de respuesta inválido');
        } catch (error) {
            console.error('Error en findAll:', error);
            throw error;
        }
    },

    updateUser: (userId, userData) => fetchApi(`users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData)
    }),

    deleteUser: (userId) => fetchApi(`users/${userId}`, {
        method: 'DELETE'
    })
};