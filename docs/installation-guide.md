# Guia de Instalação e Configuração - JQL Tester

## Visão Geral

Este guia fornece instruções detalhadas para instalar, configurar e executar o JQL Tester em seu ambiente local. O projeto consiste em um backend Node.js e um frontend React que trabalham em conjunto para fornecer uma interface completa para testar consultas JQL do Jira.

## Pré-requisitos

### Software Necessário

1. **Node.js** (versão 16.0 ou superior)
   - Download: https://nodejs.org/
   - Verificar instalação: `node --version`

2. **npm** (geralmente incluído com Node.js)
   - Verificar instalação: `npm --version`

3. **Git** (opcional, para clonar o repositório)
   - Download: https://git-scm.com/
   - Verificar instalação: `git --version`

### Conta Jira Cloud

1. **Instância do Jira Cloud**
   - URL no formato: `https://sua-empresa.atlassian.net`
   - Acesso administrativo ou permissões adequadas

2. **Token de API do Jira**
   - Gerado em: https://id.atlassian.com/manage-profile/security/api-tokens
   - Necessário para autenticação

## Estrutura do Projeto

```
jql-tester/
├── backend/                 # Servidor Node.js/Express
│   ├── server.js
│   ├── routes/
│   ├── package.json
│   └── .env
├── frontend/                # Aplicação React
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env
└── docs/                    # Documentação
    ├── backend-documentation.md
    ├── frontend-documentation.md
    ├── installation-guide.md
    └── user-guide.md
```

## Instalação

### 1. Obter o Código Fonte

#### Opção A: Clonar Repositório (se disponível)
```bash
git clone <url-do-repositorio>
cd jql-tester
```

#### Opção B: Download Manual
1. Baixe o arquivo ZIP do projeto
2. Extraia para uma pasta local
3. Navegue até a pasta do projeto

### 2. Instalação do Backend

```bash
# Navegar para a pasta do backend
cd backend

# Instalar dependências
npm install

# Verificar se todas as dependências foram instaladas
npm list
```

#### Dependências do Backend

As seguintes dependências serão instaladas automaticamente:

```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "axios": "^1.6.0",
  "dotenv": "^16.3.1",
  "helmet": "^7.1.0",
  "express-rate-limit": "^7.1.5",
  "joi": "^17.11.0",
  "nodemon": "^3.0.1"
}
```

### 3. Instalação do Frontend

```bash
# Navegar para a pasta do frontend (a partir da raiz do projeto)
cd ../frontend

# Instalar dependências
npm install

# Verificar se todas as dependências foram instaladas
npm list
```

#### Dependências do Frontend

As seguintes dependências serão instaladas automaticamente:

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-scripts": "5.0.1",
  "axios": "^1.6.0",
  "react-router-dom": "^6.8.0",
  "react-hook-form": "^7.43.0",
  "react-hot-toast": "^2.4.0",
  "lucide-react": "^0.263.0",
  "tailwindcss": "^3.2.0",
  "autoprefixer": "^10.4.13",
  "postcss": "^8.4.21"
}
```

## Configuração

### 1. Configuração do Backend

#### Criar Arquivo de Ambiente

```bash
# Na pasta backend
cp .env.example .env
```

#### Editar Arquivo .env

```bash
# .env

# Configuração do servidor
PORT=3001
NODE_ENV=development

# URL do frontend para CORS
FRONTEND_URL=http://localhost:3000

# Configurações opcionais do Jira (podem ser definidas via interface)
# JIRA_DOMAIN=https://sua-empresa.atlassian.net
# JIRA_EMAIL=seu-email@empresa.com
# JIRA_TOKEN=seu-token-de-api
```

#### Configurações Detalhadas

| Variável | Descrição | Valor Padrão | Obrigatório |
|----------|-----------|--------------|-------------|
| `PORT` | Porta do servidor backend | 3001 | Não |
| `NODE_ENV` | Ambiente de execução | development | Não |
| `FRONTEND_URL` | URL do frontend para CORS | http://localhost:3000 | Não |
| `JIRA_DOMAIN` | URL da instância Jira | - | Não* |
| `JIRA_EMAIL` | Email do usuário Jira | - | Não* |
| `JIRA_TOKEN` | Token de API do Jira | - | Não* |

*As configurações do Jira podem ser definidas via interface web ou arquivo .env

### 2. Configuração do Frontend

#### Criar Arquivo de Ambiente (Opcional)

```bash
# Na pasta frontend
touch .env
```

#### Editar Arquivo .env (Opcional)

```bash
# .env

# URL da API backend
REACT_APP_API_URL=http://localhost:3001

# Versão da aplicação
REACT_APP_VERSION=1.0.0
```

#### Configurações do Proxy

O frontend já está configurado para usar proxy no `package.json`:

```json
{
  "proxy": "http://localhost:3001"
}
```

### 3. Configuração do Jira Cloud

#### Gerar Token de API

1. **Acessar Atlassian Account**
   - Vá para: https://id.atlassian.com/manage-profile/security/api-tokens
   - Faça login com sua conta Atlassian

2. **Criar Token**
   - Clique em "Create API token"
   - Digite um nome descritivo (ex: "JQL Tester")
   - Clique em "Create"
   - **IMPORTANTE**: Copie o token imediatamente (não será mostrado novamente)

3. **Informações Necessárias**
   - **Domínio**: URL completa do Jira (ex: https://minhaempresa.atlassian.net)
   - **Email**: Seu email de login no Jira
   - **Token**: O token gerado no passo anterior

#### Permissões Necessárias

O usuário deve ter as seguintes permissões no Jira:

- **Browse Projects**: Para visualizar projetos
- **Search Issues**: Para executar consultas JQL
- **View Development Tools**: Para acessar campos customizados (opcional)

## Execução

### 1. Iniciar o Backend

```bash
# Na pasta backend
cd backend

# Modo desenvolvimento (com auto-reload)
npm run dev

# OU modo produção
npm start
```

**Saída esperada:**
```
Servidor rodando na porta 3001
Ambiente: development
```

### 2. Iniciar o Frontend

```bash
# Em um novo terminal, na pasta frontend
cd frontend

# Iniciar servidor de desenvolvimento
npm start
```

**Saída esperada:**
```
Compiled successfully!

You can now view jql-tester in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.100:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

### 3. Acessar a Aplicação

1. **Abrir Navegador**
   - URL: http://localhost:3000

2. **Verificar Conectividade**
   - O frontend deve carregar sem erros
   - Verificar se não há erros no console do navegador

## Verificação da Instalação

### 1. Health Check do Backend

```bash
# Testar endpoint de health check
curl http://localhost:3001/health
```

**Resposta esperada:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600
}
```

### 2. Teste de Conectividade Frontend-Backend

1. Abra o navegador em http://localhost:3000
2. Vá para "Configurações"
3. Preencha as credenciais do Jira
4. Clique em "Testar Conexão"
5. Deve aparecer uma mensagem de sucesso

### 3. Teste Completo

1. **Configurar Jira**
   - Inserir domínio, email e token
   - Testar conexão

2. **Executar Consulta**
   - Ir para "Consultas"
   - Inserir uma consulta JQL simples (ex: `project is not EMPTY`)
   - Executar consulta
   - Verificar se os resultados aparecem

## Solução de Problemas

### Problemas Comuns

#### 1. Erro "EADDRINUSE" (Porta em Uso)

**Problema**: Porta 3001 ou 3000 já está em uso

**Solução**:
```bash
# Verificar processos usando a porta
netstat -ano | findstr :3001

# Matar processo (Windows)
taskkill /PID <PID> /F

# OU alterar porta no .env
PORT=3002
```

#### 2. Erro de CORS

**Problema**: Erro de CORS ao conectar frontend com backend

**Solução**:
1. Verificar se `FRONTEND_URL` está correto no .env do backend
2. Verificar se o proxy está configurado no package.json do frontend
3. Limpar cache do navegador

#### 3. Erro "Module not found"

**Problema**: Dependências não instaladas corretamente

**Solução**:
```bash
# Limpar cache e reinstalar
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 4. Erro de Conexão com Jira

**Problema**: Não consegue conectar com o Jira

**Verificações**:
1. URL do Jira está correta (https://empresa.atlassian.net)
2. Email está correto
3. Token de API é válido e não expirou
4. Usuário tem permissões adequadas
5. Firewall/proxy corporativo não está bloqueando

#### 5. Erro "Cannot read property of undefined"

**Problema**: Erro JavaScript no frontend

**Solução**:
1. Verificar se o backend está rodando
2. Verificar logs do console do navegador
3. Limpar localStorage: `localStorage.clear()`
4. Recarregar a página

### Logs e Debugging

#### Backend Logs

```bash
# Logs detalhados
NODE_ENV=development npm run dev

# Logs de erro
tail -f logs/error.log
```

#### Frontend Logs

1. **Console do Navegador**
   - F12 → Console
   - Verificar erros JavaScript

2. **Network Tab**
   - F12 → Network
   - Verificar requisições HTTP

3. **React Developer Tools**
   - Extensão do navegador
   - Inspecionar estado dos componentes

### Comandos Úteis

```bash
# Verificar versões
node --version
npm --version

# Verificar processos rodando
ps aux | grep node

# Verificar portas em uso
netstat -tulpn | grep :3001

# Limpar cache npm
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules package-lock.json && npm install

# Build de produção (frontend)
npm run build

# Servir build de produção
npx serve -s build
```

## Configuração para Produção

### 1. Build do Frontend

```bash
cd frontend
npm run build
```

### 2. Configuração do Backend para Produção

```bash
# .env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://seu-dominio.com
```

### 3. Servir Arquivos Estáticos

```javascript
// server.js (adicionar)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
}
```

### 4. Process Manager (PM2)

```bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicação
pm2 start server.js --name "jql-tester-backend"

# Configurar auto-start
pm2 startup
pm2 save
```

## Segurança

### Considerações de Segurança

1. **Variáveis de Ambiente**
   - Nunca commitar arquivos .env
   - Usar variáveis de ambiente em produção

2. **HTTPS**
   - Usar HTTPS em produção
   - Configurar certificados SSL

3. **Rate Limiting**
   - Já configurado (100 req/15min)
   - Ajustar conforme necessário

4. **Firewall**
   - Abrir apenas portas necessárias
   - Configurar regras de firewall

### Backup e Recuperação

1. **Backup de Configurações**
   - Fazer backup dos arquivos .env
   - Documentar configurações customizadas

2. **Backup de Dados**
   - Histórico de consultas (localStorage)
   - Configurações de usuário

## Suporte

### Recursos Adicionais

1. **Documentação do Jira**
   - https://developer.atlassian.com/cloud/jira/platform/rest/v3/
   - https://support.atlassian.com/jira-software-cloud/docs/advanced-search-reference-jql-fields/

2. **Documentação das Tecnologias**
   - React: https://reactjs.org/docs/
   - Express: https://expressjs.com/
   - Node.js: https://nodejs.org/docs/

3. **Comunidade**
   - Stack Overflow
   - GitHub Issues
   - Atlassian Community

### Contato

Para suporte técnico ou dúvidas sobre a instalação:

1. Verificar este guia de instalação
2. Consultar a documentação técnica
3. Verificar logs de erro
4. Criar issue no repositório (se aplicável)

---

**Nota**: Este guia assume um ambiente de desenvolvimento local. Para implantação em produção, considere fatores adicionais como balanceamento de carga, monitoramento, backup e recuperação.