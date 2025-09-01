import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3003';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'Erro de conexão';
    
    if (error.response) {
      // Erro com resposta do servidor
      const { data, status } = error.response;
      
      // Verificar se é erro de autenticação
      if (status === 401) {
        // Token expirado ou inválido - fazer logout
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '/login';
        errorMessage = 'Sessão expirada. Faça login novamente.';
      } else if (data?.error) {
        errorMessage = data.error;
        if (data.details && Array.isArray(data.details)) {
          errorMessage += ': ' + data.details.join(', ');
        }
      } else {
        errorMessage = `Erro HTTP ${status}`;
      }
    } else if (error.request) {
      // Erro de rede
      errorMessage = 'Erro de conexão com o servidor';
    } else {
      // Outros erros
      errorMessage = error.message || 'Erro desconhecido';
    }
    
    throw new Error(errorMessage);
  }
);

export const jiraApi = {
  // Testar conexão com Jira
  async testConnection(config) {
    const response = await api.post('/api/jira/test-connection', config);
    return response.data;
  },

  // Executar consulta JQL
  async executeQuery(queryData) {
    const response = await api.post('/api/jira/search', queryData);
    return response.data;
  },

  // Obter campos disponíveis
  async getFields(config) {
    const response = await api.post('/api/jira/fields', config);
    return response.data;
  },

  // Health check do servidor
  async healthCheck() {
    const response = await api.get('/health');
    return response.data;
  }
};

// Função de login
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Erro de conexão' };
  }
};

// Função de registro
export const register = async (name, email, password) => {
  try {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Erro de conexão' };
  }
};

export default api;