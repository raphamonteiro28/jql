# Documentação do JQL Tester

Bem-vindo à documentação completa do JQL Tester - uma ferramenta web para testar e executar consultas JQL (Jira Query Language) de forma intuitiva e eficiente.

## 📋 Índice da Documentação

### 🚀 Para Começar
- **[Guia de Instalação](installation-guide.md)** - Como instalar e configurar a aplicação
- **[Guia do Usuário](user-guide.md)** - Como usar a aplicação (interface, consultas JQL, etc.)

### 🔧 Documentação Técnica
- **[Documentação do Backend](backend-documentation.md)** - API, rotas, configuração do servidor
- **[Documentação do Frontend](frontend-documentation.md)** - Componentes React, páginas, contextos

## 🎯 Sobre o Projeto

O JQL Tester é uma aplicação web full-stack que permite:

- ✅ **Conexão Segura** com Jira Cloud via API tokens
- ✅ **Editor de Consultas JQL** com validação em tempo real
- ✅ **Histórico de Consultas** para reutilização rápida
- ✅ **Visualização de Resultados** organizada e intuitiva
- ✅ **Interface Responsiva** que funciona em desktop e mobile

## 🏗️ Arquitetura

### Backend (Node.js + Express)
- **API RESTful** para comunicação com Jira
- **Validação de dados** com Joi
- **Tratamento de erros** robusto
- **Middleware de segurança** (CORS, Helmet, etc.)

### Frontend (React)
- **Interface moderna** com Tailwind CSS
- **Gerenciamento de estado** com Context API
- **Roteamento** com React Router
- **Formulários** com React Hook Form

## 🛠️ Tecnologias Utilizadas

### Backend
- Node.js 18+
- Express.js
- Axios (para requisições HTTP)
- Joi (validação)
- Helmet (segurança)
- CORS

### Frontend
- React 18
- React Router DOM
- React Hook Form
- Tailwind CSS
- Lucide React (ícones)
- Axios (cliente HTTP)

## 📦 Estrutura do Projeto

```
jql-tester/
├── backend/                 # Servidor Node.js
│   ├── src/
│   │   ├── routes/         # Rotas da API
│   │   ├── middleware/     # Middlewares
│   │   ├── services/       # Lógica de negócio
│   │   └── utils/          # Utilitários
│   ├── package.json
│   └── server.js
├── frontend/               # Aplicação React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── contexts/       # Contextos React
│   │   ├── services/       # Serviços de API
│   │   └── styles/         # Estilos CSS
│   ├── public/
│   └── package.json
└── docs/                   # Documentação
    ├── README.md           # Este arquivo
    ├── installation-guide.md
    ├── user-guide.md
    ├── backend-documentation.md
    └── frontend-documentation.md
```

## 🚀 Início Rápido

### 1. Pré-requisitos
- Node.js 18 ou superior
- npm ou yarn
- Conta no Jira Cloud
- Token de API do Atlassian

### 2. Instalação

```bash
# Clonar o repositório
git clone <repository-url>
cd jql-tester

# Instalar dependências do backend
cd backend
npm install

# Instalar dependências do frontend
cd ../frontend
npm install
```

### 3. Configuração

**Backend (.env):**
```env
PORT=3001
NODE_ENV=development
```

**Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:3001
```

### 4. Executar

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

### 5. Acessar
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 📖 Como Usar

1. **Configure sua conexão** com o Jira Cloud (URL, email, token)
2. **Teste a conexão** para verificar se está funcionando
3. **Escreva consultas JQL** no editor
4. **Execute e visualize** os resultados
5. **Reutilize consultas** do histórico

## 🔒 Segurança

- **Tokens de API** são armazenados apenas localmente no navegador
- **Comunicação HTTPS** recomendada para produção
- **Validação de entrada** em todas as rotas da API
- **Rate limiting** configurável
- **Headers de segurança** via Helmet

## 🐛 Solução de Problemas

### Problemas Comuns

1. **Erro de CORS**
   - Verifique se o backend está rodando
   - Confirme as configurações de CORS

2. **Credenciais inválidas**
   - Verifique se o token não expirou
   - Confirme se o email está correto

3. **Consulta JQL inválida**
   - Verifique a sintaxe da consulta
   - Confirme se os campos existem no Jira

### Logs e Depuração

- **Backend**: Logs no console do servidor
- **Frontend**: Console do navegador (F12)
- **Network**: Aba Network para requisições HTTP

## 📞 Suporte

### Recursos Úteis

- **[Documentação JQL Oficial](https://support.atlassian.com/jira-software-cloud/docs/advanced-search-reference-jql-fields/)**
- **[API do Jira Cloud](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)**
- **[Gerenciar Tokens de API](https://id.atlassian.com/manage-profile/security/api-tokens)**

### Reportar Problemas

Se encontrar bugs ou tiver sugestões:

1. Verifique se o problema já foi reportado
2. Inclua informações detalhadas:
   - Versão do navegador
   - Passos para reproduzir
   - Mensagens de erro
   - Screenshots (se aplicável)

## 🔄 Atualizações

### Versão Atual: 1.0.0

**Funcionalidades:**
- ✅ Conexão com Jira Cloud
- ✅ Editor de consultas JQL
- ✅ Histórico de consultas
- ✅ Visualização de resultados
- ✅ Interface responsiva

### Roadmap

**Próximas Versões:**
- 🔄 Exportação de resultados (CSV, JSON)
- 🔄 Salvamento de consultas favoritas
- 🔄 Autocomplete para campos JQL
- 🔄 Temas escuro/claro
- 🔄 Suporte a múltiplas instâncias Jira

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

**Desenvolvido com ❤️ para facilitar o trabalho com consultas JQL**

*Última atualização: Janeiro 2025*