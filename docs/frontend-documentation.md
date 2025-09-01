# Documentação Técnica - Frontend JQL Tester

## Visão Geral

O frontend do JQL Tester é uma aplicação React moderna que fornece uma interface intuitiva para testar e executar consultas JQL (Jira Query Language). A aplicação utiliza React Hooks, Context API para gerenciamento de estado global e Tailwind CSS para estilização.

## Arquitetura

### Tecnologias Utilizadas

- **React 18**: Biblioteca principal para construção da interface
- **React Router DOM**: Roteamento entre páginas
- **React Hook Form**: Gerenciamento de formulários
- **React Hot Toast**: Notificações toast
- **Axios**: Cliente HTTP para comunicação com o backend
- **Lucide React**: Biblioteca de ícones
- **Tailwind CSS**: Framework CSS utilitário
- **PostCSS & Autoprefixer**: Processamento de CSS

### Estrutura de Diretórios

```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Header.js
│   │   ├── QueryBuilder.js
│   │   └── QueryTester.js
│   ├── contexts/           # Contextos React
│   │   └── JiraContext.js
│   ├── pages/              # Páginas da aplicação
│   │   ├── Home.js
│   │   ├── Settings.js
│   │   ├── QueryTester.js
│   │   └── About.js
│   ├── services/           # Serviços de API
│   │   └── api.js
│   ├── styles/             # Arquivos de estilo
│   │   └── index.css
│   ├── App.js              # Componente principal
│   └── index.js            # Ponto de entrada
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## Componente Principal (App.js)

### Estrutura e Roteamento

```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { JiraProvider } from './contexts/JiraContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <JiraProvider>
      <Router>
        <div className="min-h-screen bg-secondary-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/query" element={<QueryTester />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
        </div>
        <Toaster position="top-right" />
      </Router>
    </JiraProvider>
  );
}
```

### Características

- **Provider Pattern**: Utiliza JiraProvider para estado global
- **Roteamento**: React Router para navegação SPA
- **Layout Responsivo**: Container centralizado com padding responsivo
- **Notificações**: React Hot Toast para feedback do usuário

## Gerenciamento de Estado (JiraContext.js)

### Estrutura do Estado

```javascript
const initialState = {
  // Configuração do Jira
  config: {
    domain: '',
    email: '',
    token: ''
  },
  
  // Estado da conexão
  isConnected: false,
  isLoading: false,
  user: null,
  
  // Consultas JQL
  lastQuery: '',
  queryHistory: [],
  
  // Campos do Jira
  fields: []
};
```

### Actions do Reducer

```javascript
const jiraReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CONFIG':
    case 'SET_LOADING':
    case 'SET_CONNECTION_SUCCESS':
    case 'SET_CONNECTION_ERROR':
    case 'SET_QUERY_RESULT':
    case 'SET_FIELDS':
    case 'DISCONNECT':
    case 'ADD_TO_HISTORY':
    // ... implementações
  }
};
```

### Funções Principais

#### updateConfig(newConfig)
- Atualiza configuração do Jira
- Persiste no localStorage
- Reseta estado de conexão

#### testConnection()
- Testa conectividade com Jira
- Atualiza estado de conexão
- Obtém informações do usuário

#### executeQuery(jql, startAt, maxResults)
- Executa consulta JQL
- Adiciona ao histórico
- Retorna resultados formatados

#### loadFields()
- Carrega metadados de campos do Jira
- Cache local para performance

### Persistência Local

```javascript
// Salva configuração no localStorage
useEffect(() => {
  localStorage.setItem('jiraConfig', JSON.stringify(state.config));
}, [state.config]);

// Salva histórico no localStorage
useEffect(() => {
  localStorage.setItem('queryHistory', JSON.stringify(state.queryHistory));
}, [state.queryHistory]);
```

## Páginas

### 1. Home (Home.js)

**Funcionalidades:**
- Dashboard principal da aplicação
- Status da conexão com Jira
- Histórico de consultas recentes
- Guia de início rápido
- Cards de funcionalidades

**Componentes Principais:**
```javascript
// Hero Section com status de conexão
{isConnected ? (
  <div className="bg-green-100 text-green-800">
    <CheckCircle className="h-5 w-5" />
    <span>Conectado como {user?.displayName}</span>
  </div>
) : (
  <div className="bg-yellow-100 text-yellow-800">
    <AlertCircle className="h-5 w-5" />
    <span>Configure sua conexão com o Jira</span>
  </div>
)}

// Histórico de consultas recentes
{recentQueries.map((item, index) => (
  <div key={index} className="query-history-item">
    <code>{item.query}</code>
    <span>{item.resultCount} resultados</span>
    <Link to={`/query?q=${encodeURIComponent(item.query)}`}>
      Executar
    </Link>
  </div>
))}
```

### 2. Settings (Settings.js)

**Funcionalidades:**
- Configuração de credenciais do Jira
- Validação de formulário com React Hook Form
- Teste de conexão em tempo real
- Instruções detalhadas

**Validação de Formulário:**
```javascript
const { register, handleSubmit, formState: { errors, isDirty }, watch } = useForm({
  defaultValues: config
});

// Validação de domínio
{...register('domain', {
  required: 'URL do Jira é obrigatória',
  pattern: {
    value: /^https:\/\/[a-zA-Z0-9-]+\.atlassian\.net$/,
    message: 'URL deve estar no formato: https://empresa.atlassian.net'
  }
})}

// Validação de email
{...register('email', {
  required: 'Email é obrigatório',
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Email inválido'
  }
})}
```

**Funcionalidades de UX:**
- Toggle de visibilidade do token
- Botão de teste de conexão
- Link direto para geração de token
- Feedback visual de status

### 3. QueryTester (QueryTester.js)

**Funcionalidades:**
- Editor de consultas JQL
- Execução de consultas
- Exibição de resultados
- Histórico de consultas
- Paginação de resultados

**Componentes Principais:**
```javascript
// Editor de consulta
<textarea
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  placeholder="Digite sua consulta JQL aqui..."
  className="query-editor"
/>

// Botão de execução
<button
  onClick={handleExecuteQuery}
  disabled={!query.trim() || isLoading}
  className="btn-primary"
>
  {isLoading ? 'Executando...' : 'Executar Consulta'}
</button>

// Exibição de resultados
{results && (
  <div className="results-container">
    <div className="results-header">
      <span>{results.total} resultados encontrados</span>
    </div>
    {results.issues.map(issue => (
      <div key={issue.key} className="issue-card">
        <h3>{issue.key}</h3>
        <p>{issue.fields.summary}</p>
      </div>
    ))}
  </div>
)}
```

### 4. About (About.js)

**Funcionalidades:**
- Informações sobre a aplicação
- Documentação de JQL
- Exemplos de consultas
- Links úteis

## Componentes

### 1. Header (Header.js)

**Funcionalidades:**
- Navegação principal
- Logo da aplicação
- Menu responsivo
- Indicador de status de conexão

```javascript
<nav className="bg-white shadow-sm border-b border-secondary-200">
  <div className="container mx-auto px-4">
    <div className="flex justify-between items-center h-16">
      <Link to="/" className="flex items-center space-x-2">
        <Zap className="h-8 w-8 text-primary-600" />
        <span className="text-xl font-bold">JQL Tester</span>
      </Link>
      
      <div className="hidden md:flex space-x-8">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/query">Consultas</NavLink>
        <NavLink to="/settings">Configurações</NavLink>
        <NavLink to="/about">Sobre</NavLink>
      </div>
    </div>
  </div>
</nav>
```

### 2. QueryBuilder (QueryBuilder.js)

**Funcionalidades:**
- Construtor visual de consultas JQL
- Autocomplete de campos
- Validação de sintaxe
- Sugestões inteligentes

### 3. QueryTester (QueryTester.js)

**Funcionalidades:**
- Interface para execução de consultas
- Histórico de consultas
- Exportação de resultados
- Paginação

## Serviços

### API Service (api.js)

**Configuração do Axios:**
```javascript
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

**Interceptor de Erros:**
```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'Erro de conexão';
    
    if (error.response) {
      const { data, status } = error.response;
      if (data?.error) {
        errorMessage = data.error;
        if (data.details && Array.isArray(data.details)) {
          errorMessage += ': ' + data.details.join(', ');
        }
      } else {
        errorMessage = `Erro HTTP ${status}`;
      }
    } else if (error.request) {
      errorMessage = 'Erro de conexão com o servidor';
    }
    
    throw new Error(errorMessage);
  }
);
```

**Métodos da API:**
```javascript
export const jiraApi = {
  // Testar conexão com Jira
  async testConnection(config) {
    const response = await api.post('/api/jira/test-connection', config);
    return response.data;
  },

  // Executar consulta JQL
  async executeQuery(queryData) {
    const response = await api.post('/api/jira/search', queryData);
    return response.data;
  },

  // Obter campos disponíveis
  async getFields(config) {
    const response = await api.post('/api/jira/fields', config);
    return response.data;
  },

  // Health check do servidor
  async healthCheck() {
    const response = await api.get('/health');
    return response.data;
  }
};
```

## Estilização

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          // ... outras variações
          600: '#2563eb',
          900: '#1e3a8a'
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          // ... outras variações
          600: '#475569',
          900: '#0f172a'
        }
      }
    },
  },
  plugins: [],
}
```

### Classes CSS Customizadas

```css
/* index.css */

/* Componentes de botão */
.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
  @apply btn bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500;
}

.btn-outline {
  @apply btn border border-secondary-300 text-secondary-700 hover:bg-secondary-50 focus:ring-secondary-500;
}

/* Componentes de input */
.input {
  @apply w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent;
}

/* Componentes de card */
.card {
  @apply bg-white rounded-lg shadow-sm border border-secondary-200;
}

.card-header {
  @apply px-6 py-4 border-b border-secondary-200;
}

.card-content {
  @apply px-6 py-4;
}

/* Alertas */
.alert-success {
  @apply p-4 bg-green-50 border border-green-200 rounded-lg text-green-800;
}

.alert-info {
  @apply p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800;
}
```

## Hooks Customizados

### useJira Hook

```javascript
// Disponibilizado pelo JiraContext
const {
  // Estado
  config,
  isConnected,
  isLoading,
  user,
  lastQuery,
  queryHistory,
  fields,
  
  // Ações
  updateConfig,
  testConnection,
  executeQuery,
  loadFields,
  disconnect
} = useJira();
```

## Tratamento de Erros

### Estratégias de Error Handling

1. **Boundary de Erro**: Captura erros não tratados
2. **Try-Catch**: Em operações assíncronas
3. **Validação de Formulário**: React Hook Form
4. **Feedback Visual**: Toast notifications

```javascript
// Exemplo de tratamento de erro
try {
  await executeQuery(query);
  toast.success('Consulta executada com sucesso!');
} catch (error) {
  toast.error(error.message || 'Erro ao executar consulta');
}
```

## Performance e Otimizações

### Técnicas Utilizadas

1. **React.memo**: Componentes que não precisam re-renderizar
2. **useCallback**: Memoização de funções
3. **useMemo**: Memoização de valores computados
4. **Lazy Loading**: Carregamento sob demanda
5. **Code Splitting**: Divisão de código por rotas

```javascript
// Exemplo de otimização
const MemoizedQueryResult = React.memo(({ result }) => {
  return (
    <div className="query-result">
      {/* Renderização do resultado */}
    </div>
  );
});

const handleExecuteQuery = useCallback(async () => {
  // Lógica de execução
}, [query, config]);
```

## Acessibilidade

### Práticas Implementadas

1. **Semantic HTML**: Uso correto de tags semânticas
2. **ARIA Labels**: Labels para elementos interativos
3. **Keyboard Navigation**: Navegação por teclado
4. **Focus Management**: Gerenciamento de foco
5. **Color Contrast**: Contraste adequado de cores

```javascript
// Exemplo de acessibilidade
<button
  aria-label="Executar consulta JQL"
  aria-describedby="query-help"
  disabled={!query.trim()}
>
  Executar
</button>

<div id="query-help" className="sr-only">
  Digite uma consulta JQL válida para executar
</div>
```

## Testes

### Estratégia de Testes

1. **Unit Tests**: Componentes individuais
2. **Integration Tests**: Fluxos completos
3. **E2E Tests**: Testes de ponta a ponta

```javascript
// Exemplo de teste unitário
import { render, screen, fireEvent } from '@testing-library/react';
import { JiraProvider } from '../contexts/JiraContext';
import Settings from '../pages/Settings';

test('should validate email format', () => {
  render(
    <JiraProvider>
      <Settings />
    </JiraProvider>
  );
  
  const emailInput = screen.getByLabelText(/email/i);
  fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
  
  expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
});
```

## Build e Deploy

### Scripts de Build

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

### Configuração de Proxy

```json
{
  "proxy": "http://localhost:3001"
}
```

### Variáveis de Ambiente

```bash
# .env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_VERSION=1.0.0
```

## Considerações de Segurança

1. **Sanitização de Dados**: Validação de entrada
2. **HTTPS**: Comunicação segura
3. **Token Storage**: Armazenamento seguro no localStorage
4. **XSS Prevention**: Prevenção de ataques XSS
5. **CSRF Protection**: Proteção contra CSRF

## Roadmap de Melhorias

1. **PWA**: Transformar em Progressive Web App
2. **Offline Support**: Suporte offline
3. **Dark Mode**: Tema escuro
4. **Internacionalização**: Suporte a múltiplos idiomas
5. **Advanced Query Builder**: Construtor visual avançado
6. **Export Features**: Exportação de resultados
7. **Query Sharing**: Compartilhamento de consultas
8. **Performance Monitoring**: Monitoramento de performance