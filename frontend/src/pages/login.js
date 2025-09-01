import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import jiraLabLogo from '../assets/JiraLab-removebg-preview.png';

// Este é nosso componente de Login
function Login() {
  // useState é um "hook" do React que guarda informações
  // Aqui guardamos o email que o usuário digita
  const [email, setEmail] = useState('');
  
  // Aqui guardamos a senha que o usuário digita
  const [password, setPassword] = useState('');
  
  // Esta variável controla se a senha está visível ou escondida
  const [showPassword, setShowPassword] = useState(false);
  
  // Esta variável controla se estamos carregando (fazendo login)
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para mostrar mensagens de erro
  const [error, setError] = useState('');
  
  // Hook para navegar entre páginas
  const navigate = useNavigate();
  
  // Hook para pegar informações da localização atual
  const location = useLocation();
  
  // Hook para usar as funções de autenticação
  const { login, isAuthenticated } = useAuth();
  
  // Pega a página que o usuário tentou acessar antes do login
  const from = location.state?.from?.pathname || '/';
  
  // Se o usuário já está logado, redireciona para a página inicial
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Esta função é chamada quando o usuário clica em "Entrar"
  const handleSubmit = async (e) => {
    // Impede que a página recarregue
    e.preventDefault();
    
    // Limpa erros anteriores
    setError('');
    
    // Mostra que estamos carregando
    setIsLoading(true);
    
    try {
      // Chama a função de login do contexto
      const result = await login(email, password);
      
      if (result.success) {
        // Se o login foi bem-sucedido, redireciona para a página que o usuário tentou acessar
        navigate(from, { replace: true });
      } else {
        // Se houve erro, mostra a mensagem
        setError(result.error || 'Erro ao fazer login');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Erro inesperado. Tente novamente.');
    } finally {
      // Para de mostrar o carregamento
      setIsLoading(false);
    }
  };

  // Esta função alterna entre mostrar/esconder a senha
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Cabeçalho da página */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src={jiraLabLogo} 
              alt="JiraLab Logo" 
              className="h-20 w-auto"
            />
          </div>
          <h2 className="text-3xl font-bold text-secondary-900">
            JiraLab
          </h2>
          <p className="mt-2 text-secondary-600">
            Faça login para acessar o sistema
          </p>
        </div>

        {/* Formulário de login */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Mensagem de erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            {/* Campo de Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-700">
                Email
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <User className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-secondary-300 rounded-md placeholder-secondary-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="seu.email@exemplo.com"
                />
              </div>
            </div>

            {/* Campo de Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700">
                Senha
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Lock className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-secondary-300 rounded-md placeholder-secondary-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-secondary-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-secondary-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Botão de Login */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>

          {/* Links de navegação */}
          <div className="text-center space-y-2">
            <div className="text-sm text-secondary-600">
              <p>
                Não tem uma conta?{' '}
                <Link
                  to="/register"
                  className="text-primary-600 hover:text-primary-500 font-medium"
                >
                  Registre-se aqui!
                </Link>
              </p>
            </div>
            <Link
              to="/"
              className="text-secondary-600 hover:text-secondary-500 text-sm"
            >
              ← Voltar para a página inicial
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;