import React, { useState } from 'react';
import { useJira } from '../contexts/JiraContext';
import { useForm } from 'react-hook-form';
import { Settings as SettingsIcon, TestTube, Save, Eye, EyeOff, ExternalLink, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

function Settings() {
  const { config, isConnected, isLoading, user, updateConfig, testConnection } = useJira();
  const [showToken, setShowToken] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isDirty }, watch } = useForm({
    defaultValues: config
  });

  const watchedValues = watch();

  const onSubmit = async (data) => {
    updateConfig(data);
    toast.success('Configurações salvas!');
  };

  const handleTestConnection = async () => {
    if (isDirty) {
      // Salvar configurações antes de testar
      updateConfig(watchedValues);
    }
    
    setIsTesting(true);
    await testConnection();
    setIsTesting(false);
  };

  const generateTokenUrl = () => {
    return 'https://id.atlassian.com/manage-profile/security/api-tokens';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-3 bg-primary-100 rounded-full">
            <SettingsIcon className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-secondary-900">
          Configurações do Jira
        </h1>
        <p className="text-secondary-600">
          Configure sua conexão com o Jira Cloud para começar a usar o JiraLab
        </p>
      </div>

      {/* Status da conexão */}
      {isConnected && user && (
        <div className="alert-success">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <div>
              <p className="font-medium">
                Conectado com sucesso!
              </p>
              <p className="text-sm">
                Logado como: {user.displayName} ({user.emailAddress})
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Formulário de configuração */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-secondary-900">
            Credenciais de Acesso
          </h2>
          <p className="text-sm text-secondary-600">
            Insira suas credenciais do Jira Cloud para estabelecer a conexão
          </p>
        </div>
        
        <div className="card-content">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Domínio do Jira */}
            <div className="space-y-2">
              <label htmlFor="domain" className="block text-sm font-medium text-secondary-700">
                URL do Jira Cloud *
              </label>
              <input
                {...register('domain', {
                  required: 'URL do Jira é obrigatória',
                  pattern: {
                    value: /^https:\/\/[a-zA-Z0-9-]+\.atlassian\.net$/,
                    message: 'URL deve estar no formato: https://empresa.atlassian.net'
                  }
                })}
                type="url"
                id="domain"
                className="input"
                placeholder="https://sua-empresa.atlassian.net"
              />
              {errors.domain && (
                <p className="text-sm text-red-600">{errors.domain.message}</p>
              )}
              <p className="text-xs text-secondary-500">
                Exemplo: https://minhaempresa.atlassian.net
              </p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-secondary-700">
                Email *
              </label>
              <input
                {...register('email', {
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido'
                  }
                })}
                type="email"
                id="email"
                className="input"
                placeholder="seu-email@empresa.com"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Token de API */}
            <div className="space-y-2">
              <label htmlFor="token" className="block text-sm font-medium text-secondary-700">
                Token de API *
              </label>
              <div className="relative">
                <input
                  {...register('token', {
                    required: 'Token de API é obrigatório',
                    minLength: {
                      value: 10,
                      message: 'Token deve ter pelo menos 10 caracteres'
                    }
                  })}
                  type={showToken ? 'text' : 'password'}
                  id="token"
                  className="input pr-10"
                  placeholder="Seu token de API do Jira"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                >
                  {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.token && (
                <p className="text-sm text-red-600">{errors.token.message}</p>
              )}
              <div className="flex items-center space-x-2 text-xs text-secondary-500">
                <span>Não tem um token?</span>
                <a
                  href={generateTokenUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                >
                  <span>Gerar token</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={!isDirty || isLoading}
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Salvar Configurações</span>
              </button>
              
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isLoading || isTesting || !watchedValues.domain || !watchedValues.email || !watchedValues.token}
                className="btn-outline flex items-center justify-center space-x-2"
              >
                {(isLoading || isTesting) ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <TestTube className="h-4 w-4" />
                )}
                <span>
                  {(isLoading || isTesting) ? 'Testando...' : 'Testar Conexão'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Instruções */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-secondary-900">
            Como obter suas credenciais
          </h2>
        </div>
        <div className="card-content space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <h3 className="font-medium text-secondary-800">URL do Jira Cloud</h3>
                <p className="text-sm text-secondary-600">
                  Use a URL completa do seu Jira Cloud, no formato: https://sua-empresa.atlassian.net
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <h3 className="font-medium text-secondary-800">Email</h3>
                <p className="text-sm text-secondary-600">
                  Use o mesmo email que você utiliza para fazer login no Jira
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <h3 className="font-medium text-secondary-800">Token de API</h3>
                <p className="text-sm text-secondary-600 mb-2">
                  Gere um token de API em sua conta Atlassian:
                </p>
                <ol className="text-sm text-secondary-600 space-y-1 ml-4">
                  <li>1. Acesse <a href={generateTokenUrl()} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">id.atlassian.com</a></li>
                  <li>2. Faça login com sua conta</li>
                  <li>3. Vá em "Security" → "Create and manage API tokens"</li>
                  <li>4. Clique em "Create API token"</li>
                  <li>5. Dê um nome (ex: "JiraLab") e copie o token gerado</li>
                </ol>
              </div>
            </div>
          </div>
          
          <div className="alert-info">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Importante:</p>
                <p className="text-sm">
                  Suas credenciais são armazenadas apenas localmente no seu navegador e nunca são enviadas para servidores externos, exceto para a API oficial do Jira.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;