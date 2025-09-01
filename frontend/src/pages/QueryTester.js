import React, { useState, useEffect } from 'react';
import { useJira } from '../contexts/JiraContext';
import { useSearchParams } from 'react-router-dom';
import { Search, Play, History, Download, Copy, ExternalLink, AlertCircle, Clock, User, Calendar, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import UnrestrictedQueryGuide from '../components/UnrestrictedQueryGuide';
import QueryBuilder from '../components/QueryBuilder';

function QueryTester() {
  const { isConnected, isLoading, executeQuery, queryHistory, loadFields, addToFavorites, removeFromFavorites, isFavorite, favoriteQueries } = useJira();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [queryOptions, setQueryOptions] = useState({
    maxResults: 50,
    startAt: 0,
    fields: ['summary', 'status', 'assignee', 'created', 'updated', 'priority']
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Carregar query da URL se existir
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    if (urlQuery) {
      setQuery(urlQuery);
    }
  }, [searchParams]);

  // Carregar campos disponíveis quando conectado
  useEffect(() => {
    if (isConnected) {
      loadFields();
    }
  }, [isConnected, loadFields]);

  const handleExecuteQuery = async (pageNumber = 1) => {
    if (!query.trim()) {
      toast.error('Digite uma consulta JQL');
      return;
    }

    const startAt = (pageNumber - 1) * queryOptions.maxResults;
    const options = { ...queryOptions, startAt };
    
    const result = await executeQuery(query, options);
    setResults(result);
    setCurrentPage(pageNumber);
  };

  const handleQueryFromHistory = (historyQuery) => {
    setQuery(historyQuery);
    setShowHistory(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência!');
  };

  const toggleFavorite = () => {
    if (!query.trim()) {
      toast.error('Digite um filtro para adicionar aos favoritos');
      return;
    }

    if (isFavorite(query)) {
      const favorite = favoriteQueries.find(fav => fav.query === query.trim());
      if (favorite) {
        removeFromFavorites(favorite.id);
        toast.success('Consulta removida dos favoritos!');
      }
    } else {
      const success = addToFavorites(query);
      if (success) {
        toast.success('Consulta adicionada aos favoritos!');
      } else {
        toast.error('Esta consulta já está nos favoritos');
      }
    }
  };

  const exportResults = () => {
    if (!results || !results.issues.length) {
      toast.error('Nenhum resultado para exportar');
      return;
    }

    const csvContent = [
      ['Key', 'Summary', 'Status', 'Assignee', 'Created', 'Updated'].join(','),
      ...results.issues.map(issue => [
        issue.key,
        `"${issue.fields.summary?.replace(/"/g, '""') || ''}"`,
        issue.fields.status?.name || '',
        issue.fields.assignee?.displayName || 'Unassigned',
        issue.fields.created ? new Date(issue.fields.created).toLocaleDateString('pt-BR') : '',
        issue.fields.updated ? new Date(issue.fields.updated).toLocaleDateString('pt-BR') : ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `jql-results-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success('Resultados exportados!');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getStatusColor = (status) => {
    const statusName = status?.name?.toLowerCase() || '';
    
    // Status verdes: Concluído, Aguardando liberação
    if (statusName.includes('concluído') || statusName.includes('concluido') || 
        statusName.includes('aguardando liberação') || statusName.includes('aguardando liberacao') ||
        statusName.includes('done') || statusName.includes('closed')) {
      return 'bg-green-100 text-green-800';
    }
    
    // Status vermelhos: Cancelado, Rejeitado, Teste rejeitado, Bloqueado teste
    if (statusName.includes('cancelado') || statusName.includes('rejeitado') ||
        statusName.includes('teste rejeitado') || statusName.includes('bloqueado teste') ||
        statusName.includes('cancelled') || statusName.includes('rejected')) {
      return 'bg-red-100 text-red-800';
    }
    
    // Status cinza: Aberto
    if (statusName.includes('aberto') || statusName.includes('open') || statusName.includes('todo')) {
      return 'bg-gray-100 text-gray-800';
    }
    
    // Status azul para progresso/desenvolvimento (mantido)
    if (statusName.includes('progress') || statusName.includes('development') || statusName.includes('em andamento')) {
      return 'bg-blue-100 text-blue-800';
    }
    
    // Padrão amarelo para outros status
    return 'bg-yellow-100 text-yellow-800';
  };

  const getPriorityColor = (priority) => {
    const priorityName = priority?.name?.toLowerCase() || '';
    if (priorityName.includes('highest') || priorityName.includes('critical')) return 'text-red-600';
    if (priorityName.includes('high')) return 'text-orange-600';
    if (priorityName.includes('medium')) return 'text-yellow-600';
    if (priorityName.includes('low')) return 'text-green-600';
    return 'text-gray-600';
  };

  if (!isConnected) {
    return (
      <div className="text-center space-y-4">
        <div className="alert-warning">
          <div className="flex items-center justify-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">
              Você precisa estar conectado ao Jira para executar consultas
            </span>
          </div>
        </div>
        <p className="text-secondary-600">
          Configure sua conexão nas configurações para começar a usar o JiraLab.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-secondary-900">
          Testador de Consultas JQL
        </h1>
        <p className="text-secondary-600">
          Execute e teste suas consultas JQL (Jira Query Language)
        </p>
      </div>

      {/* Query Builder */}
      <QueryBuilder onQueryGenerated={setQuery} />

      {/* Query Input */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-secondary-900">
              Consulta JQL
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="btn-outline btn text-sm"
              >
                <History className="h-4 w-4 mr-1" />
                Histórico
              </button>
            </div>
          </div>
        </div>
        
        <div className="card-content space-y-4">
          {/* Histórico e Favoritos */}
          {showHistory && (
            <div className="border border-secondary-200 rounded-lg p-6 bg-secondary-50 space-y-6">
              {/* Favoritos */}
              {favoriteQueries.length > 0 && (
                <div>
                  <h3 className="font-medium text-secondary-800 mb-4 flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-600" />
                    <span>Consultas Favoritas</span>
                  </h3>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {favoriteQueries.map((favorite) => (
                      <div key={favorite.id} className="flex items-center justify-between p-4 bg-white rounded border border-yellow-200">
                        <div className="flex-1 pr-4">
                          <code className="text-sm text-secondary-700 block mb-2">{favorite.query}</code>
                          <div className="text-xs text-secondary-500">
                            Adicionado em {formatDate(favorite.timestamp)}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQueryFromHistory(favorite.query)}
                            className="btn-outline btn text-xs"
                          >
                            Usar
                          </button>
                          <button
                            onClick={() => {
                              removeFromFavorites(favorite.id);
                              toast.success('Favorito removido!');
                            }}
                            className="btn-outline btn text-xs text-red-600 border-red-600 hover:bg-red-50"
                            title="Remover dos favoritos"
                          >
                            <Star className="h-3 w-3 fill-current" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Histórico */}
              {queryHistory.length > 0 && (
                <div>
                  <h3 className="font-medium text-secondary-800 mb-4 flex items-center space-x-2">
                    <History className="h-4 w-4" />
                    <span>Consultas Recentes</span>
                  </h3>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {queryHistory.slice(0, 10).map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white rounded border">
                        <div className="flex-1 pr-4">
                          <code className="text-sm text-secondary-700 block mb-2">{item.query}</code>
                          <div className="text-xs text-secondary-500">
                            {formatDate(item.timestamp)} • {item.resultCount} resultados
                          </div>
                        </div>
                        <button
                          onClick={() => handleQueryFromHistory(item.query)}
                          className="btn-outline btn text-xs ml-4"
                        >
                          Usar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {favoriteQueries.length === 0 && queryHistory.length === 0 && (
                <div className="text-center py-8 text-secondary-500">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma consulta no histórico ou favoritos ainda.</p>
                </div>
              )}
            </div>
          )}

          {/* Query Input */}
          <div className="space-y-2">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Digite sua consulta JQL aqui...\n\nExemplos de consultas amplas:\n• project = 'PROJ' AND status = 'In Progress'\n• priority = High AND status != Done\n• created >= -7d\n• assignee is EMPTY\n• status changed during (-1w, now())"
              className="textarea min-h-[120px] font-mono text-sm"
              rows={6}
            />
            
            {/* Query Options */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <label className="text-secondary-600">Resultados por página:</label>
                <select
                  value={queryOptions.maxResults}
                  onChange={(e) => {
                    const newMaxResults = parseInt(e.target.value);
                    setQueryOptions({...queryOptions, maxResults: newMaxResults});
                    setCurrentPage(1);
                  }}
                  className="input w-20 text-sm"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>

          {/* Execute Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleExecuteQuery(1)}
              disabled={isLoading || !query.trim()}
              className="btn-primary flex items-center space-x-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Play className="h-4 w-4" />
              )}
              <span>{isLoading ? 'Executando...' : 'Executar Consulta'}</span>
            </button>
            
            {query && (
              <>
                <button
                  onClick={() => copyToClipboard(query)}
                  className="btn-outline flex items-center space-x-2"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copiar</span>
                </button>
                
                <button
                  onClick={toggleFavorite}
                  className={`btn-outline flex items-center space-x-2 ${
                    isFavorite(query) ? 'text-yellow-600 border-yellow-600 hover:bg-yellow-50' : ''
                  }`}
                  title={isFavorite(query) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  <Star className={`h-4 w-4 ${isFavorite(query) ? 'fill-current' : ''}`} />
                  <span>{isFavorite(query) ? 'Favorito' : 'Favoritar'}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Dicas para Construção de Consulta */}
      <UnrestrictedQueryGuide />

      {/* Results */}
      {results && (
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-secondary-900">
                  Resultados
                </h2>
                <p className="text-sm text-secondary-600">
                  {results.total} resultados encontrados
                  {results.total > results.maxResults && ` (mostrando ${results.issues.length})`}
                </p>
              </div>
              
              {results.issues.length > 0 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={exportResults}
                    className="btn-outline flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Exportar CSV</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="card-content">
            {results.issues.length === 0 ? (
              <div className="text-center py-8 text-secondary-500">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum resultado encontrado para esta consulta.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Results Summary */}
                <div className="flex items-center justify-between pb-4 border-b border-secondary-200">
                  <div className="flex items-center space-x-4 text-sm text-secondary-600">
                    <span>Mostrando {results.startAt + 1}-{results.startAt + results.issues.length} de {results.total}</span>
                    <span>• Página {currentPage} de {Math.ceil(results.total / queryOptions.maxResults)}</span>
                  </div>
                  
                  {/* Pagination Controls */}
                  {results.total > queryOptions.maxResults && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleExecuteQuery(currentPage - 1)}
                        disabled={currentPage === 1 || isLoading}
                        className="btn-outline btn text-sm flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Anterior</span>
                      </button>
                      
                      <span className="text-sm text-secondary-600 px-2">
                        {currentPage} / {Math.ceil(results.total / queryOptions.maxResults)}
                      </span>
                      
                      <button
                        onClick={() => handleExecuteQuery(currentPage + 1)}
                        disabled={currentPage >= Math.ceil(results.total / queryOptions.maxResults) || isLoading}
                        className="btn-outline btn text-sm flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>Próximo</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Issues List */}
                <div className="space-y-3">
                  {results.issues.map((issue) => (
                    <div key={issue.key} className="border border-secondary-200 rounded-lg p-6 hover:bg-secondary-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          {/* Issue Key and Summary */}
                          <div className="flex items-center space-x-3">
                            <a
                              href={issue.self.replace('/rest/api/3/issue/', '/browse/')}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                            >
                              <span>{issue.key}</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                            
                            {issue.fields.status && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.fields.status)}`}>
                                {issue.fields.status.name}
                              </span>
                            )}
                            
                            {issue.fields.priority && (
                              <span className={`text-xs font-medium ${getPriorityColor(issue.fields.priority)}`}>
                                {issue.fields.priority.name}
                              </span>
                            )}
                          </div>
                          
                          <h3 className="font-medium text-secondary-900">
                            {issue.fields.summary}
                          </h3>
                          
                          {/* Metadata */}
                          <div className="flex flex-wrap items-center gap-4 text-xs text-secondary-500">
                            {issue.fields.assignee && (
                              <div className="flex items-center space-x-1">
                                <User className="h-3 w-3" />
                                <span>{issue.fields.assignee.displayName}</span>
                              </div>
                            )}
                            
                            {issue.fields.created && (
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>Criado: {formatDate(issue.fields.created)}</span>
                              </div>
                            )}
                            
                            {issue.fields.updated && (
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>Atualizado: {formatDate(issue.fields.updated)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Pagination */}
                {results.total > queryOptions.maxResults && (
                  <div className="flex items-center justify-center space-x-4 pt-4 border-t border-secondary-200">
                    <button
                      onClick={() => handleExecuteQuery(currentPage - 1)}
                      disabled={currentPage === 1 || isLoading}
                      className="btn-outline btn text-sm flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Anterior</span>
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      {/* Page Numbers */}
                      {(() => {
                        const totalPages = Math.ceil(results.total / queryOptions.maxResults);
                        const pages = [];
                        const startPage = Math.max(1, currentPage - 2);
                        const endPage = Math.min(totalPages, currentPage + 2);
                        
                        if (startPage > 1) {
                          pages.push(
                            <button
                              key={1}
                              onClick={() => handleExecuteQuery(1)}
                              className="btn-outline btn text-sm w-8 h-8 p-0"
                            >
                              1
                            </button>
                          );
                          if (startPage > 2) {
                            pages.push(<span key="start-ellipsis" className="text-secondary-400">...</span>);
                          }
                        }
                        
                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(
                            <button
                              key={i}
                              onClick={() => handleExecuteQuery(i)}
                              className={`btn text-sm w-8 h-8 p-0 ${
                                i === currentPage ? 'btn-primary' : 'btn-outline'
                              }`}
                            >
                              {i}
                            </button>
                          );
                        }
                        
                        if (endPage < totalPages) {
                          if (endPage < totalPages - 1) {
                            pages.push(<span key="end-ellipsis" className="text-secondary-400">...</span>);
                          }
                          pages.push(
                            <button
                              key={totalPages}
                              onClick={() => handleExecuteQuery(totalPages)}
                              className="btn-outline btn text-sm w-8 h-8 p-0"
                            >
                              {totalPages}
                            </button>
                          );
                        }
                        
                        return pages;
                      })()}
                    </div>
                    
                    <button
                      onClick={() => handleExecuteQuery(currentPage + 1)}
                      disabled={currentPage >= Math.ceil(results.total / queryOptions.maxResults) || isLoading}
                      className="btn-outline btn text-sm flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>Próximo</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Exemplos Rápidos */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-secondary-900">
            Exemplos Rápidos
          </h2>
        </div>
        <div className="card-content">
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <div className="space-y-2">
              <code className="block bg-secondary-100 p-2 rounded text-xs">project = "PROJ"</code>
              <code className="block bg-secondary-100 p-2 rounded text-xs">status = "In Progress"</code>
              <code className="block bg-secondary-100 p-2 rounded text-xs">priority = High</code>
            </div>
            <div className="space-y-2">
              <code className="block bg-secondary-100 p-2 rounded text-xs">created >= -7d</code>
              <code className="block bg-secondary-100 p-2 rounded text-xs">assignee is EMPTY</code>
              <code className="block bg-secondary-100 p-2 rounded text-xs">resolved >= -30d</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QueryTester;