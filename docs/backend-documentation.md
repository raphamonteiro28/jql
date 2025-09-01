# Documentação Técnica - Backend JQL Tester

## Visão Geral

O backend do JQL Tester é uma API REST desenvolvida em Node.js com Express.js que serve como intermediário entre o frontend React e a API do Jira Cloud. Ele fornece endpoints seguros para testar conexões, executar consultas JQL e obter metadados de campos do Jira.

## Arquitetura

### Tecnologias Utilizadas

- **Node.js**: Runtime JavaScript
- **Express.js**: Framework web para Node.js
- **Axios**: Cliente HTTP para requisições à API do Jira
- **Joi**: Biblioteca de validação de esquemas
- **Helmet**: Middleware de segurança
- **CORS**: Middleware para controle de acesso entre origens
- **Express Rate Limit**: Middleware para limitação de taxa de requisições
- **dotenv**: Gerenciamento de variáveis de ambiente

### Estrutura de Diretórios

```
backend/
├── server.js              # Servidor principal e configuração
├── routes/
│   └── jira.js           # Rotas relacionadas ao Jira
├── package.json          # Dependências e scripts
├── .env.example          # Exemplo de variáveis de ambiente
└── .env                  # Variáveis de ambiente (não versionado)
```

## Configuração do Servidor (server.js)

### Middlewares de Segurança

```javascript
// Helmet para headers de segurança
app.use(helmet());

// Rate limiting - máximo 100 requisições por 15 minutos
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requisições por IP
  message: 'Muitas requisições deste IP, tente novamente em 15 minutos.'
});
app.use(limiter);
```

### Configuração CORS

```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://192.168.1.100:3000',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
```

### Rotas Principais

- `GET /health` - Health check do servidor
- `/api/jira/*` - Rotas relacionadas ao Jira
- Middleware de tratamento de erros 404 e 500

## API Endpoints

### 1. Teste de Conexão

**Endpoint:** `POST /api/jira/test-connection`

**Descrição:** Testa a conectividade com a instância do Jira Cloud

**Payload:**
```json
{
  "domain": "https://empresa.atlassian.net",
  "email": "usuario@empresa.com",
  "token": "ATATT3xFfGF0..."
}
```

**Validação (Joi Schema):**
```javascript
const jiraConfigSchema = Joi.object({
  domain: Joi.string().uri().required(),
  email: Joi.string().email().required(),
  token: Joi.string().min(10).required()
});
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "user": {
    "accountId": "5b10ac8d82e05b22cc7d4ef5",
    "displayName": "João Silva",
    "emailAddress": "joao@empresa.com"
  }
}
```

**Códigos de Status:**
- `200` - Conexão bem-sucedida
- `400` - Dados de entrada inválidos
- `401` - Credenciais inválidas
- `403` - Acesso negado
- `500` - Erro interno do servidor

### 2. Execução de Consultas JQL

**Endpoint:** `POST /api/jira/search`

**Descrição:** Executa uma consulta JQL e retorna os resultados

**Payload:**
```json
{
  "config": {
    "domain": "https://empresa.atlassian.net",
    "email": "usuario@empresa.com",
    "token": "ATATT3xFfGF0..."
  },
  "jql": "project = PROJ AND status = 'In Progress'",
  "startAt": 0,
  "maxResults": 50
}
```

**Validação (Joi Schema):**
```javascript
const jqlQuerySchema = Joi.object({
  config: jiraConfigSchema.required(),
  jql: Joi.string().min(1).required(),
  startAt: Joi.number().integer().min(0).default(0),
  maxResults: Joi.number().integer().min(1).max(100).default(50)
});
```

**Resposta de Sucesso:**
```json
{
  "total": 25,
  "startAt": 0,
  "maxResults": 50,
  "issues": [
    {
      "key": "PROJ-123",
      "id": "10001",
      "self": "https://empresa.atlassian.net/rest/api/3/issue/10001",
      "fields": {
        "summary": "Título da issue",
        "status": {
          "name": "In Progress"
        },
        "assignee": {
          "displayName": "João Silva"
        }
      }
    }
  ]
}
```

### 3. Obtenção de Campos

**Endpoint:** `POST /api/jira/fields`

**Descrição:** Obtém metadados dos campos disponíveis no Jira

**Payload:**
```json
{
  "domain": "https://empresa.atlassian.net",
  "email": "usuario@empresa.com",
  "token": "ATATT3xFfGF0..."
}
```

**Resposta de Sucesso:**
```json
{
  "fields": [
    {
      "id": "summary",
      "name": "Summary",
      "custom": false,
      "searchable": true,
      "navigable": true
    },
    {
      "id": "customfield_10001",
      "name": "Story Points",
      "custom": true,
      "searchable": true,
      "navigable": true
    }
  ]
}
```

## Autenticação

### Método de Autenticação

O backend utiliza **Basic Authentication** para se comunicar com a API do Jira:

```javascript
function createAuthHeaders(email, token) {
  const auth = Buffer.from(`${email}:${token}`).toString('base64');
  return {
    'Authorization': `Basic ${auth}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
}
```

### Segurança

- **Rate Limiting**: Máximo 100 requisições por IP a cada 15 minutos
- **Helmet**: Headers de segurança HTTP
- **CORS**: Controle de acesso entre origens
- **Validação de Entrada**: Todos os dados são validados com Joi
- **Tratamento de Erros**: Respostas padronizadas sem exposição de dados sensíveis

## Tratamento de Erros

### Estrutura de Erro Padrão

```json
{
  "error": "Mensagem de erro amigável",
  "details": ["Detalhes específicos do erro"]
}
```

### Códigos de Status HTTP

- `200` - Sucesso
- `400` - Dados de entrada inválidos
- `401` - Credenciais inválidas
- `403` - Acesso negado
- `404` - Recurso não encontrado
- `429` - Muitas requisições (rate limit)
- `500` - Erro interno do servidor

### Tratamento Específico por Endpoint

#### Test Connection
- **401**: "Credenciais inválidas. Verifique seu email e token."
- **403**: "Acesso negado. Verifique as permissões da sua conta."
- **404**: "Instância do Jira não encontrada. Verifique a URL."

#### JQL Search
- **400**: "Consulta JQL inválida" + detalhes específicos do Jira
- **401**: "Credenciais inválidas"
- **403**: "Sem permissão para executar esta consulta"

## Variáveis de Ambiente

### Arquivo .env

```bash
# Configuração do servidor
PORT=3001
NODE_ENV=development

# URL do frontend para CORS
FRONTEND_URL=http://localhost:3000

# Configurações opcionais do Jira (podem ser definidas via interface)
JIRA_DOMAIN=https://sua-empresa.atlassian.net
JIRA_EMAIL=seu-email@empresa.com
JIRA_TOKEN=seu-token-de-api
```

### Configurações Padrão

- **PORT**: 3001 (padrão)
- **NODE_ENV**: development
- **Timeout**: 30 segundos para requisições HTTP
- **Rate Limit**: 100 requisições por 15 minutos

## Scripts NPM

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

## Dependências

### Dependências de Produção

```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "axios": "^1.6.0",
  "dotenv": "^16.3.1",
  "helmet": "^7.1.0",
  "express-rate-limit": "^7.1.5",
  "joi": "^17.11.0"
}
```

### Dependências de Desenvolvimento

```json
{
  "nodemon": "^3.0.1"
}
```

## Logs e Monitoramento

### Logs de Erro

Todos os erros são logados no console com informações detalhadas:

```javascript
console.error('Erro ao testar conexão:', {
  error: error.message,
  status: error.response?.status,
  data: error.response?.data
});
```

### Health Check

Endpoint `/health` retorna o status do servidor:

```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600
}
```

## Considerações de Performance

1. **Timeout de Requisições**: 30 segundos para evitar travamentos
2. **Rate Limiting**: Proteção contra abuso da API
3. **Validação Eficiente**: Joi para validação rápida de esquemas
4. **Tratamento de Erros**: Respostas rápidas sem processamento desnecessário

## Integração com Jira Cloud API

### Endpoints Utilizados

- `GET /rest/api/3/myself` - Informações do usuário atual
- `POST /rest/api/3/search` - Execução de consultas JQL
- `GET /rest/api/3/field` - Metadados de campos

### Autenticação

Utiliza Basic Authentication com email + API Token conforme documentação oficial do Jira Cloud.

### Rate Limits do Jira

O Jira Cloud possui seus próprios rate limits que são respeitados pelo backend através de tratamento adequado de erros 429.