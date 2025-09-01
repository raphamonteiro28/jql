import React from 'react';
import { useJira } from '../contexts/JiraContext';
import { Star, Search, Copy, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Favorites() {
  const { favoriteQueries, removeFromFavorites } = useJira();
  const navigate = useNavigate();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Consulta copiada para a área de transferência!');
  };

  const useQuery = (query) => {
    navigate(`/query?q=${encodeURIComponent(query)}`);
  };

  const removeFavorite = (favoriteId, queryText) => {
    removeFromFavorites(favoriteId);
    toast.success('Consulta removida dos favoritos!');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-secondary-900 flex items-center justify-center space-x-2">
          <Star className="h-6 w-6 text-yellow-600" />
          <span>Minhas consultas salvas</span>
        </h1>
        <p className="text-secondary-600">
          Gerencie seus filtros favoritos salvos
        </p>
      </div>

      {/* Favorites List */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-secondary-900">
              Suas consultas favoritas:
            </h2>
            <div className="text-sm text-secondary-600">
              {favoriteQueries.length} {favoriteQueries.length === 1 ? 'favorito' : 'favoritos'}
            </div>
          </div>
        </div>
        
        <div className="card-content">
          {favoriteQueries.length === 0 ? (
            <div className="text-center py-12 text-secondary-500">
              <Star className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium mb-2">Nenhuma consulta favorita ainda</h3>
              <p className="mb-4">
                Adicione consultas aos favoritos clicando no ícone de estrela na página de consultas.
              </p>
              <button
                onClick={() => navigate('/query')}
                className="btn-primary flex items-center space-x-2 mx-auto"
              >
                <Search className="h-4 w-4" />
                <span>Ir para consultas</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {favoriteQueries.map((favorite) => (
                <div key={favorite.id} className="border border-yellow-200 rounded-lg p-6 bg-yellow-50 hover:bg-yellow-100 transition-colors">
                  <div className="space-y-3">
                    {/* Header with star icon */}
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-600 fill-current" />
                      <span className="text-sm font-medium text-secondary-700">
                        JQL:
                      </span>
                    </div>
                    
                    {/* Query Text and Actions aligned */}
                    <div className="flex items-center space-x-4">
                      <code className="flex-1 bg-white p-4 rounded border text-sm text-secondary-800 font-mono break-all">
                        {favorite.query}
                      </code>
                      
                      {/* Actions aligned with text bar */}
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <button
                          onClick={() => useQuery(favorite.query)}
                          className="btn-primary btn text-sm flex items-center space-x-1"
                          title="Usar esta consulta"
                        >
                          <Search className="h-3 w-3" />
                          <span>Usar</span>
                        </button>
                        
                        <button
                          onClick={() => copyToClipboard(favorite.query)}
                          className="btn-outline btn text-sm flex items-center space-x-1"
                          title="Copiar consulta"
                        >
                          <Copy className="h-3 w-3" />
                          <span>Copiar</span>
                        </button>
                        
                        <button
                          onClick={() => removeFavorite(favorite.id, favorite.query)}
                          className="btn-outline btn text-sm text-red-600 border-red-600 hover:bg-red-50 flex items-center space-x-1"
                          title="Remover dos favoritos"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Remover</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Metadata */}
                    <div className="text-xs text-secondary-500">
                      Adicionado em {formatDate(favorite.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      {favoriteQueries.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-secondary-900">
              Dicas
            </h2>
          </div>
          <div className="card-content">
            <div className="space-y-2 text-sm text-secondary-600">
              <p>• Clique em "Usar" para executar a consulta na página de testes</p>
              <p>• Use "Copiar" para copiar a consulta para a área de transferência</p>
              <p>• Seus favoritos são salvos localmente no navegador</p>
              <p>• Adicione novas consultas aos favoritos na página de consultas JQL</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Favorites;