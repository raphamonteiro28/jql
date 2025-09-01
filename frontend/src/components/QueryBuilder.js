import React, { useState, useEffect } from 'react';
import { Play, Copy, Save } from 'lucide-react';
import toast from 'react-hot-toast';

function QueryBuilder({ onQueryGenerated, onExecuteQuery }) {
  const [savedQueries, setSavedQueries] = useState([]);



  // Carregar consultas salvas do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('jql-saved-queries');
    if (saved) {
      setSavedQueries(JSON.parse(saved));
    }
  }, []);





  const saveQuery = (query) => {
    if (!query) {
      toast.error('Nenhuma consulta para salvar');
      return;
    }

    const name = prompt('Nome para a consulta:');
    if (name) {
      const newQuery = {
        id: Date.now(),
        name,
        query: query,
        created: new Date().toISOString()
      };
      
      const updated = [...savedQueries, newQuery];
      setSavedQueries(updated);
      localStorage.setItem('jql-saved-queries', JSON.stringify(updated));
      toast.success('Consulta salva com sucesso!');
    }
  };

  const loadSavedQuery = (query) => {
    if (onQueryGenerated) {
      onQueryGenerated(query);
    }
    toast.success('Consulta carregada!');
  };

  const deleteSavedQuery = (id) => {
    const updated = savedQueries.filter(q => q.id !== id);
    setSavedQueries(updated);
    localStorage.setItem('jql-saved-queries', JSON.stringify(updated));
    toast.success('Consulta removida!');
  };

  return (
    <div className="space-y-6">



      {/* Consultas Salvas */}
      {savedQueries.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-secondary-800">Consultas Salvas:</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {savedQueries.map(saved => (
              <div key={saved.id} className="flex items-center justify-between p-5 bg-secondary-50 rounded border">
                <div className="flex-1 pr-4">
                  <div className="font-medium text-sm text-secondary-800 mb-2">{saved.name}</div>
                  <code className="text-xs text-secondary-600 block mb-2 p-2 bg-white rounded">{saved.query}</code>
                  <div className="text-xs text-secondary-500">
                    Criada em: {new Date(saved.created).toLocaleString('pt-BR')}
                  </div>
                </div>
                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => loadSavedQuery(saved.query)}
                    className="btn-outline btn text-xs"
                  >
                    Carregar
                  </button>
                  <button
                    onClick={() => deleteSavedQuery(saved.id)}
                    className="btn-outline btn text-xs text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dicas */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-4">💡 Dicas para Construção de Consultas</h4>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• Use <code className="bg-blue-100 px-2 py-1 rounded">EMPTY</code> para campos vazios</li>
          <li>• Use <code className="bg-blue-100 px-2 py-1 rounded">currentUser()</code> para o usuário atual</li>
          <li>• Use <code className="bg-blue-100 px-2 py-1 rounded">now()</code> para data/hora atual</li>
          <li>• Para datas relativas: <code className="bg-blue-100 px-2 py-1 rounded">-7d</code> (7 dias atrás), <code className="bg-blue-100 px-2 py-1 rounded">-1w</code> (1 semana atrás)</li>
          <li>• Para múltiplos valores com 'in': separe por vírgula (ex: PROJ1, PROJ2)</li>
          <li>• Valores com espaços são automaticamente colocados entre aspas</li>
        </ul>
      </div>
    </div>
  );
}

export default QueryBuilder;