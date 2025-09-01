import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Este é o contexto de autenticação - pense nele como um "cofre" global
// onde guardamos informações sobre se o usuário está logado ou não
const AuthContext = createContext();

// Estados possíveis da autenticação
const authStates = {
  LOADING: 'loading',     // Carregando (verificando se está logado)
  AUTHENTICATED: 'authenticated',  // Usuário está logado
  UNAUTHENTICATED: 'unauthenticated'  // Usuário não está logado
};

// Estado inicial da autenticação
const initialState = {
  status: authStates.LOADING,
  user: null,  // Informações do usuário logado
  token: null  // Token de autenticação
};

// Reducer - função que controla como o estado muda
// É como um "controlador" que decide o que fazer quando algo acontece
function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        status: authStates.AUTHENTICATED,
        user: action.payload.user,
        token: action.payload.token
      };
    
    case 'LOGOUT':
      return {
        status: authStates.UNAUTHENTICATED,
        user: null,
        token: null
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        status: authStates.LOADING
      };
    
    case 'SET_UNAUTHENTICATED':
      return {
        status: authStates.UNAUTHENTICATED,
        user: null,
        token: null
      };
    
    default:
      return state;
  }
}

// Provider - componente que "envolve" nossa aplicação
// e fornece as funções de autenticação para todos os componentes filhos
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Função para fazer login
  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      
      // Chamada real para a API do backend
      const response = await fetch('http://localhost:3003/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
      }
      
      if (data.token) {
        // Salva no localStorage para persistir entre sessões
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        // Atualiza o estado
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: data.user,
            token: data.token
          }
        });
        
        return { success: true };
      } else {
        throw new Error(data.message || 'Credenciais inválidas');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      dispatch({ type: 'SET_UNAUTHENTICATED' });
      return { 
        success: false, 
        error: error.message || 'Erro ao conectar com o servidor'
      };
    }
  };

  // Função para fazer registro
  const register = async (name, email, password) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      
      // Chamada real para a API do backend
      const response = await fetch('http://localhost:3003/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar conta');
      }
      
      if (data.token) {
        // Salva no localStorage para persistir entre sessões
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        // Atualiza o estado
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: data.user,
            token: data.token
          }
        });
        
        return { success: true };
      } else {
        throw new Error(data.message || 'Erro ao criar conta');
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      dispatch({ type: 'SET_UNAUTHENTICATED' });
      return { 
        success: false, 
        error: error.message || 'Erro ao conectar com o servidor'
      };
    }
  };

  // Função para fazer logout
  const logout = () => {
    // Remove dados do localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    // Atualiza o estado
    dispatch({ type: 'LOGOUT' });
  };

  // Função para verificar se o usuário já está logado
  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        // Verifica se o token ainda é válido no servidor
        const response = await fetch('http://localhost:3003/api/auth/verify', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const user = JSON.parse(userData);
          
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: user,
              token: token
            }
          });
        } else {
          // Token inválido, fazer logout
          logout();
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        // Em caso de erro de rede, mantém o usuário logado localmente
        try {
          const user = JSON.parse(userData);
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: user,
              token: token
            }
          });
        } catch (parseError) {
          logout();
        }
      }
    } else {
      dispatch({ type: 'SET_UNAUTHENTICATED' });
    }
  };

  // useEffect roda quando o componente é carregado
  // Aqui verificamos se o usuário já está logado
  useEffect(() => {
    checkAuth();
  }, []);

  // Valores que serão disponibilizados para todos os componentes
  const value = {
    // Estado atual
    ...state,
    
    // Funções
    login,
    register,
    logout,
    checkAuth,
    
    // Estados para facilitar verificações
    isLoading: state.status === authStates.LOADING,
    isAuthenticated: state.status === authStates.AUTHENTICATED,
    isUnauthenticated: state.status === authStates.UNAUTHENTICATED
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar o contexto de autenticação
// Use este hook em qualquer componente que precise de autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}

// Exporta os estados para uso em outros lugares
export { authStates };