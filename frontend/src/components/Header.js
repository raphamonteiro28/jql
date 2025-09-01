import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useJira } from '../contexts/JiraContext';
import { useAuth } from '../contexts/AuthContext';
import { Search, Settings, Home, Info, User, LogOut, Star, LogIn } from 'lucide-react';
import mvLogo from '../assets/Captura_de_tela_2025-08-26_165756-removebg-preview.png';

function Header() {
  const location = useLocation();
  const { isConnected, user, disconnect } = useJira();
  const { isAuthenticated, user: authUser, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/query', label: 'Sua consulta JQL', icon: Search },
    { path: '/favorites', label: 'Favoritos', icon: Star },
    { path: '/settings', label: 'Configurações', icon: Settings },
    { path: '/about', label: 'Sobre', icon: Info }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Não mostrar o header na página de login
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <header className="bg-white shadow-lg border-b-2 border-green-500">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo MV */}
          <div className="flex items-center">
            <div className="p-2">
              <img src={mvLogo} alt="MV Sistemas" className="h-12 w-auto" />
            </div>
          </div>

          {/* Navegação */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(path)
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          {/* Status de autenticação e conexão */}
          <div className="flex items-center space-x-4 text-gray-800">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Status da conexão Jira */}
                {isConnected && user ? (
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-600 font-medium">Jira Conectado</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-yellow-600">Jira Desconectado</span>
                  </div>
                )}
                
                {/* Usuário logado */}
                <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-md border border-blue-200">
                  <User className="h-4 w-4 text-gray-700" />
                  <span className="text-sm font-medium text-gray-700">
                    {authUser?.name || authUser?.email}
                  </span>
                </div>
                
                {/* Botões de ação */}
                <div className="flex items-center space-x-1">
                  {isConnected && (
                    <button
                      onClick={disconnect}
                      className="flex items-center space-x-1 px-2 py-1 text-sm text-gray-700 hover:text-yellow-600 transition-colors"
                      title="Desconectar do Jira"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 px-2 py-1 text-sm text-gray-700 hover:text-red-600 transition-colors"
                    title="Fazer Logout"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Sair</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600">Não logado</span>
                </div>
                
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Entrar</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Navegação mobile */}
        <div className="md:hidden border-t border-green-200">
          <nav className="flex space-x-1 py-2 overflow-x-auto">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive(path)
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;