import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Componente que protege rotas - só permite acesso se o usuário estiver logado
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Se ainda está carregando (verificando se está logado), mostra uma tela de carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não está logado, redireciona para a página de login
  // O 'state' guarda a página que o usuário tentou acessar para redirecionar depois do login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se está logado, mostra o conteúdo da página
  return children;
}

export default ProtectedRoute;