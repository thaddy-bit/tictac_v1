const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let _token: string | null = localStorage.getItem('tictac_token');

export function setApiToken(token: string | null) {
  _token = token;
  if (token) {
    localStorage.setItem('tictac_token', token);
  } else {
    localStorage.removeItem('tictac_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  if (_token) {
    headers['Authorization'] = `Bearer ${_token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // Ensure cookies are sent
    });

    const contentType = response.headers.get('content-type');
    let data: any = {};

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    if (!response.ok) {
      const error: any = new Error(data.error || `Erreur serveur (${response.status})`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data as T;
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Le serveur est injoignable. Vérifiez votre connexion.');
    }
    throw error;
  }
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body: any) => request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: any) => request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
