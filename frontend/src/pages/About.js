import React from 'react';
import { ExternalLink, Shield, Code, Database, Globe } from 'lucide-react';
import jiraLabLogo from '../assets/JiraLab-removebg-preview.png';

function About() {
  const features = [
    {
      icon: Code,
      title: 'Validação em Tempo Real',
      description: 'Valide suas consultas JQL antes da execução para evitar erros e otimizar performance.'
    },
    {
      icon: Database,
      title: 'Integração Completa',
      description: 'Conecta diretamente com a API REST v3 do Jira Cloud usando autenticação segura.'
    },
    {
      icon: Globe,
      title: 'Interface Moderna',
      description: 'Interface web responsiva e intuitiva, construída com React e Tailwind CSS.'
    },
    {
      icon: Shield,
      title: 'Segurança',
      description: 'Suas credenciais são armazenadas apenas localmente e nunca enviadas para servidores externos.'
    }
  ];

  const technologies = [
    { name: 'React', description: 'Biblioteca JavaScript para interfaces de usuário' },
    { name: 'Node.js', description: 'Runtime JavaScript para o backend' },
    { name: 'Express', description: 'Framework web para Node.js' },
    { name: 'Tailwind CSS', description: 'Framework CSS utilitário' },
    { name: 'Axios', description: 'Cliente HTTP para requisições API' },
    { name: 'Jira REST API v3', description: 'API oficial do Atlassian Jira Cloud' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-primary-100 rounded-full">
            <img src={jiraLabLogo} alt="Jira Lab" className="h-12 w-12" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-secondary-900">
            Sobre o JiraLab
          </h1>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Criado para testar e validar consultas JQL de forma rápida e eficiente!
          </p>
        </div>
      </div>

      {/* Descrição */}
      <div className="card">
        <div className="card-content space-y-5">
          <h2 className="text-xl font-semibold text-secondary-900 mt-6">
            O que é o JiraLab?
          </h2>
          <div className="space-y-4 text-secondary-700">
            <p>
              O JiraLab é uma ferramenta desenvolvida para facilitar o trabalho com consultas JQL (Jira Query Language). 
              Ele permite que você teste, valide e execute consultas JQL de forma interativa, sem precisar navegar 
              constantemente pela interface do Jira.
            </p>
            <p>
              Com uma interface moderna e intuitiva, a aplicação oferece recursos como histórico de consultas, 
              validação em tempo real, exportação de resultados e exemplos práticos para ajudar tanto iniciantes 
              quanto usuários avançados do Jira.
            </p>
          </div>
        </div>
      </div>

      {/* Funcionalidades */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-secondary-900">
            Principais Funcionalidades
          </h2>
        </div>
        <div className="card-content">
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-800 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-secondary-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tecnologias */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-secondary-900">
            Tecnologias Utilizadas
          </h2>
          <p className="text-secondary-600">
            Construído com tecnologias modernas e confiáveis
          </p>
        </div>
        <div className="card-content">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {technologies.map((tech, index) => (
              <div key={index} className="p-4 border border-secondary-200 rounded-lg">
                <h3 className="font-semibold text-secondary-800 mb-1">
                  {tech.name}
                </h3>
                <p className="text-sm text-secondary-600">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Arquitetura */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-secondary-900">
            Arquitetura da Aplicação
          </h2>
        </div>
        <div className="card-content space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-secondary-800 flex items-center space-x-2">
                <Globe className="h-5 w-5 text-primary-600" />
                <span>Frontend</span>
              </h3>
              <ul className="space-y-3 text-sm text-secondary-600">
                <li className="leading-relaxed">• Interface React com componentes reutilizáveis;</li>
                <li className="leading-relaxed">• Gerenciamento de estado com Context API;</li>
                <li className="leading-relaxed">• Roteamento com React Router;</li>
                <li className="leading-relaxed">• Estilização com Tailwind CSS;</li>
                <li className="leading-relaxed">• Notificações com React Hot Toast.</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-secondary-800 flex items-center space-x-2">
                <Database className="h-5 w-5 text-primary-600" />
                <span>Backend</span>
              </h3>
              <ul className="space-y-3 text-sm text-secondary-600">
                <li className="leading-relaxed">• API REST com Express.js;</li>
                <li className="leading-relaxed">• Middleware de segurança (Helmet, CORS);</li>
                <li className="leading-relaxed">• Rate limiting para proteção;</li>
                <li className="leading-relaxed">• Validação de dados com Joi;</li>
                <li className="leading-relaxed">• Integração com Jira REST API v3;</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Segurança e Privacidade */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-secondary-900 flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary-600" />
            <span>Segurança e privacidade</span>
          </h2>
        </div>
        <div className="card-content space-y-4">
          <div className="space-y-3">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">
                Armazenamento Local
              </h3>
              <p className="text-sm text-green-700">
                Suas credenciais do Jira são armazenadas apenas no localStorage do seu navegador. 
                Elas nunca são enviadas para servidores externos, exceto diretamente para a API oficial do Jira.
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">
                Comunicação Segura
              </h3>
              <p className="text-sm text-blue-700">
                Todas as comunicações com a API do Jira são feitas através de HTTPS usando autenticação básica 
                com tokens de API, seguindo as melhores práticas de segurança da Atlassian.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">
                Código Aberto
              </h3>
              <p className="text-sm text-purple-700">
                O código fonte da aplicação está disponível para auditoria, garantindo transparência 
                sobre como seus dados são tratados.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recursos Úteis */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-secondary-900">
            Recursos Úteis
          </h2>
        </div>
        <div className="card-content">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-secondary-800">Documentação Oficial</h3>
              <div className="space-y-3">
                <a
                  href="https://developer.atlassian.com/cloud/jira/platform/rest/v3/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm p-2 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Jira REST API v3</span>
                </a>
                
                <a
                  href="https://support.atlassian.com/jira-software-cloud/docs/use-advanced-search-with-jira-query-language-jql/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm p-2 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Guia JQL Oficial</span>
                </a>
                
                <a
                  href="https://id.atlassian.com/manage-profile/security/api-tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm p-2 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Gerar Token de API</span>
                </a>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-secondary-800">Suporte</h3>
              <div className="space-y-3">
                <p className="text-sm text-secondary-600">Para dúvidas ou problemas:</p>
                <ul className="space-y-3 text-sm text-secondary-600">
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span className="leading-relaxed">Verifique a documentação oficial do Jira</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span className="leading-relaxed">Confirme suas credenciais e permissões</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span className="leading-relaxed">Teste a conectividade com sua instância Jira</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t border-secondary-200">
        <div className="space-y-4">
          <p className="text-secondary-600 leading-relaxed">
            Desenvolvido com ❤️ para a comunidade Jira
          </p>
          <p className="text-sm text-secondary-500 leading-relaxed">
            JiraLab v1.0.0 - Uma ferramenta para otimizar seu trabalho com Jira
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;