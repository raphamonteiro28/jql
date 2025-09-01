import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info, Users, Search, TrendingUp } from 'lucide-react';

function UnrestrictedQueryGuide() {
  const [isExpanded, setIsExpanded] = useState(false);

  const quickTips = [
    'Use consultas gerais para análises organizacionais',
    'Evite currentUser() para visão ampla dos dados',
    'Combine filtros com AND/OR para maior precisão'
  ];

  return (
    <div className="card">
      <div className="card-header">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center space-x-2">
            <Info className="h-4 w-4 text-blue-600" />
            <h3 className="text-base font-medium text-secondary-900">
              Dicas para Construção de Consulta
            </h3>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-secondary-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-secondary-500" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="card-content">
          <div className="bg-blue-50 p-3 rounded-lg">
            <ul className="text-sm text-blue-800 space-y-1">
              {quickTips.map((tip, index) => (
                <li key={index}>• {tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default UnrestrictedQueryGuide;