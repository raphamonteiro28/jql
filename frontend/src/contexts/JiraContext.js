import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';
import { jiraApi } from '../services/api';

const JiraContext = createContext();

const initialState = {
  config: {
    domain: '',
    email: '',
    token: ''
  },
  isConnected: false,
  isLoading: false,
  user: null,
  lastQuery: '',
  queryHistory: [],
  favoriteQueries: [],
  fields: [],
  lastResults: null,
  lastQueryOptions: null
};

function jiraReducer(state, action) {
  switch (action.type) {
    case 'SET_CONFIG':
      return {
        ...state,
        config: { ...state.config, ...action.payload }
      };
    case 'SET_CONNECTION_STATUS':
      return {
        ...state,
        isConnected: action.payload
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload
      };
    case 'SET_LAST_QUERY':
      return {
        ...state,
        lastQuery: action.payload
      };
    case 'ADD_TO_HISTORY':
      const newHistory = [action.payload, ...state.queryHistory.slice(0, 19)]; // Manter apenas 20 itens
      return {
        ...state,
        queryHistory: newHistory
      };
    case 'ADD_TO_FAVORITES':
      const newFavorites = [...state.favoriteQueries, action.payload];
      return {
        ...state,
        favoriteQueries: newFavorites
      };
    case 'REMOVE_FROM_FAVORITES':
      return {
        ...state,
        favoriteQueries: state.favoriteQueries.filter(fav => fav.id !== action.payload)
      };
    case 'SET_FAVORITES':
      return {
        ...state,
        favoriteQueries: action.payload
      };
    case 'SET_QUERY_HISTORY':
      return {
        ...state,
        queryHistory: action.payload
      };
    case 'SET_FIELDS':
      return {
        ...state,
        fields: action.payload
      };
    case 'SET_LAST_RESULTS':
      return {
        ...state,
        lastResults: action.payload
      };
    case 'SET_LAST_QUERY_OPTIONS':
      return {
        ...state,
        lastQueryOptions: action.payload
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function JiraProvider({ children }) {
  const [state, dispatch] = useReducer(jiraReducer, initialState);

  // Carregar configuração do localStorage na inicialização
  useEffect(() => {
    const savedConfig = localStorage.getItem('jiraConfig');
    const savedHistory = localStorage.getItem('queryHistory');
    const savedFavorites = localStorage.getItem('favoriteQueries');
    const savedConnectionStatus = localStorage.getItem('jiraConnectionStatus');
    
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        dispatch({ type: 'SET_CONFIG', payload: config });
        
        // Se temos configuração salva, tentar reconectar automaticamente
        if (config.domain && config.email && config.token) {
          autoReconnect(config);
        }
      } catch (error) {
        console.error('Erro ao carregar configuração:', error);
      }
    }
    
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        dispatch({ type: 'SET_QUERY_HISTORY', payload: history });
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
      }
    }
    
    if (savedFavorites) {
      try {
        const favorites = JSON.parse(savedFavorites);
        dispatch({ type: 'SET_FAVORITES', payload: favorites });
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
      }
    }
    
    // Carregar status de conexão salvo como fallback
    if (savedConnectionStatus) {
      try {
        const connectionData = JSON.parse(savedConnectionStatus);
        if (connectionData.isConnected && connectionData.user) {
          dispatch({ type: 'SET_CONNECTION_STATUS', payload: connectionData.isConnected });
          dispatch({ type: 'SET_USER', payload: connectionData.user });
        }
      } catch (error) {
        console.error('Erro ao carregar status de conexão:', error);
      }
    }
  }, []);

  // Salvar configuração no localStorage quando alterada
  useEffect(() => {
    if (state.config.domain || state.config.email || state.config.token) {
      localStorage.setItem('jiraConfig', JSON.stringify(state.config));
    }
  }, [state.config]);

  // Salvar histórico no localStorage quando alterado
  useEffect(() => {
    if (state.queryHistory.length > 0) {
      localStorage.setItem('queryHistory', JSON.stringify(state.queryHistory));
    }
  }, [state.queryHistory]);

  // Salvar favoritos no localStorage quando alterado
  useEffect(() => {
    localStorage.setItem('favoriteQueries', JSON.stringify(state.favoriteQueries));
  }, [state.favoriteQueries]);

  // Salvar status de conexão e dados do usuário
  useEffect(() => {
    if (state.isConnected && state.user) {
      localStorage.setItem('jiraConnectionStatus', JSON.stringify({
        isConnected: state.isConnected,
        user: state.user
      }));
    } else if (!state.isConnected) {
      localStorage.removeItem('jiraConnectionStatus');
    }
  }, [state.isConnected, state.user]);

  // Função para reconexão automática (silenciosa)
  const autoReconnect = async (config) => {
    try {
      const response = await jiraApi.testConnection(config);
      
      if (response.success) {
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: true });
        dispatch({ type: 'SET_USER', payload: response.user });
        console.log('Reconectado automaticamente ao Jira');
      }
    } catch (error) {
      console.log('Falha na reconexão automática:', error.message);
      // Não mostrar toast de erro na reconexão automática
    }
  };

  const updateConfig = (newConfig) => {
    dispatch({ type: 'SET_CONFIG', payload: newConfig });
  };

  const testConnection = async () => {
    if (!state.config.domain || !state.config.email || !state.config.token) {
      toast.error('Por favor, preencha todas as configurações do Jira');
      return false;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await jiraApi.testConnection(state.config);
      
      if (response.success) {
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: true });
        dispatch({ type: 'SET_USER', payload: response.user });
        toast.success('Conexão estabelecida com sucesso!');
        return true;
      }
    } catch (error) {
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: false });
      dispatch({ type: 'SET_USER', payload: null });
      toast.error(error.message || 'Erro ao conectar com o Jira');
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const executeQuery = async (jqlQuery, options = {}) => {
    if (!state.isConnected) {
      toast.error('Conecte-se ao Jira primeiro');
      return null;
    }

    if (!jqlQuery.trim()) {
      toast.error('Digite uma consulta JQL');
      return null;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const queryData = {
        ...state.config,
        jql: jqlQuery,
        ...options
      };
      
      const response = await jiraApi.executeQuery(queryData);
      
      if (response.success) {
        dispatch({ type: 'SET_LAST_QUERY', payload: jqlQuery });
        dispatch({ 
          type: 'ADD_TO_HISTORY', 
          payload: {
            query: jqlQuery,
            timestamp: new Date().toISOString(),
            resultCount: response.results.total
          }
        });
        
        toast.success(`Consulta executada: ${response.results.total} resultados encontrados`);
        return response.results;
      }
    } catch (error) {
      toast.error(error.message || 'Erro ao executar consulta');
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadFields = async () => {
    if (!state.isConnected) {
      return;
    }

    try {
      const response = await jiraApi.getFields(state.config);
      if (response.success) {
        dispatch({ type: 'SET_FIELDS', payload: response.fields });
      }
    } catch (error) {
      console.error('Erro ao carregar campos:', error);
    }
  };

  const disconnect = () => {
    dispatch({ type: 'RESET' });
    localStorage.removeItem('jiraConfig');
    localStorage.removeItem('jiraConnectionStatus');
    toast.success('Desconectado do Jira');
  };

  const addToFavorites = (query, name = null) => {
    const favoriteQuery = {
      id: Date.now().toString(),
      query: query.trim(),
      name: name || query.trim(),
      timestamp: new Date().toISOString()
    };
    
    // Verificar se a consulta já está nos favoritos
    const exists = state.favoriteQueries.some(fav => fav.query === favoriteQuery.query);
    if (!exists) {
      dispatch({ type: 'ADD_TO_FAVORITES', payload: favoriteQuery });
      return true;
    }
    return false;
  };

  const removeFromFavorites = (favoriteId) => {
    dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: favoriteId });
  };

  const isFavorite = (query) => {
    return state.favoriteQueries.some(fav => fav.query === query.trim());
  };

  const value = {
    ...state,
    updateConfig,
    testConnection,
    executeQuery,
    loadFields,
    disconnect,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };

  return (
    <JiraContext.Provider value={value}>
      {children}
    </JiraContext.Provider>
  );
}

export function useJira() {
  const context = useContext(JiraContext);
  if (!context) {
    throw new Error('useJira deve ser usado dentro de um JiraProvider');
  }
  return context;
}