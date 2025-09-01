import React from 'react';
import { Link } from 'react-router-dom';
import { useJira } from '../contexts/JiraContext';
import { Search, Settings, ArrowRight, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import jiraLabLogo from '../assets/JiraLab-removebg-preview.png';

function Home() {
  const { isConnected, user, queryHistory } = useJira();

  const features = [
    {
      icon: Search,
      title: 'Filtros avançados usando JQL',
      description: 'Execute seus filtros em JQL com validação em tempo real e sugestões inteligentes.'
    },
    {
      icon: CheckCircle,
      title: 'Validação automática',
      description: 'Valide seus filtros antes da execução para evitar erros e otimizar performance.'
    },
    {
      icon: Clock,
      title: 'Histórico de consultas',
      description: 'Mantenha um histórico das suas consultas mais utilizadas para reutilização rápida.'
    }
  ];

  const recentQueries = queryHistory.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-primary-100 rounded-full">
            <img src={jiraLabLogo} alt="Jira Lab" className="h-12 w-12" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-secondary-900">
            JiraLab
          </h1>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Teste e valide suas consultas em JQL de forma rápida e eficiente.
          </p>
        </div>

        {/* Status da conexão */}
        <div className="flex justify-center">
          {isConnected ? (
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">
                Olá, {user?.displayName}!
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">
                Configure sua conexão com o Jira para começar
              </span>
            </div>
          )}
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isConnected ? (
            <Link
              to="/query"
              className="btn-primary px-6 py-3 text-lg"
            >
              <Search className="h-5 w-5 mr-2" />
              Crie seu filtro
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          ) : (
            <Link
              to="/settings"
              className="btn-primary px-6 py-3 text-lg"
            >
              <Settings className="h-5 w-5 mr-2" />
              Configurar conexão
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">
            Principais funcionalidades
          </h2>
          <p className="text-secondary-600">
            Descubra as ferramentas que vão otimizar seu trabalho com Jira.
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="card-content space-y-6 text-center">
                  <div className="flex justify-center">
                    <div className="p-4 bg-primary-100 rounded-full">
                      <Icon className="h-8 w-8 text-primary-600" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-secondary-900 leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-secondary-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>

      {/* Histórico recente */}
      {isConnected && recentQueries.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-secondary-900">
              Consultas recentes:
            </h2>
            <p className="text-secondary-600">
              Suas últimas consultas JQL executadas. 
            </p>
            <p className="text-secondary-600">
              Se quiser executar novamente, clique em "Executar".
            </p>
          </div>
          <div className="card-content">
            <div className="space-y-3">
              {recentQueries.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                  <div className="flex-1">
                    <code className="text-sm font-mono text-secondary-800 bg-white px-2 py-1 rounded">
                      {item.query}
                    </code>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-secondary-500">
                      <span>
                        {new Date(item.timestamp).toLocaleString('pt-BR')}
                      </span>
                      <span>
                        {item.resultCount} resultados
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/query?q=${encodeURIComponent(item.query)}`}
                    className="btn-outline btn text-xs"
                  >
                    Executar
                  </Link>
                </div>
              ))}
            </div>
            
            {queryHistory.length > 5 && (
              <div className="mt-4 text-center">
                <Link
                  to="/query"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Ver todas as consultas →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Guia rápido */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-secondary-900">
            Como começar?
          </h2>
        </div>
        <div className="card-content">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="font-semibold text-secondary-800 text-lg">1. Configure sua conexão</h3>
              <p className="text-secondary-600 text-sm leading-relaxed">
                Acesse as configurações e insira:
              </p>
              <ul className="text-sm text-secondary-600 space-y-3 ml-4">
                <li className="leading-relaxed">• URL do seu Jira (ex: https://empresa.atlassian.net)</li>
                <li className="leading-relaxed">• Seu email de login</li>
                <li className="leading-relaxed">• Token de API (gerado em id.atlassian.com)</li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <h3 className="font-semibold text-secondary-800 text-lg">2. Execute consultas JQL</h3>
              <p className="text-secondary-600 text-sm leading-relaxed">
                Exemplos de consultas JQL:
              </p>
              <div className="space-y-4">
                <code className="block text-xs bg-secondary-100 p-3 rounded leading-relaxed">
                  project = "PROJ" AND status = "Aberto"
                </code>
                <code className="block text-xs bg-secondary-100 p-3 rounded leading-relaxed">
                  priority = Alta AND status != Concluído
                </code>
                <code className="block text-xs bg-secondary-100 p-3 rounded leading-relaxed">
                  created >= -7d AND assignee is not EMPTY
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;