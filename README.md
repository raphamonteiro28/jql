# JQL Tester

Uma aplicação web completa para testar e validar consultas JQL (Jira Query Language) de forma rápida e eficiente.

## 📋 Sobre o Projeto

O JQL Tester é uma ferramenta desenvolvida para facilitar o trabalho com consultas JQL. Ele permite que você teste, valide e execute consultas JQL de forma interativa, sem precisar navegar constantemente pela interface do Jira.

### ✨ Principais Funcionalidades

- **Autenticação Segura**: Conecte-se ao Jira usando tokens de API
- **Execução de Consultas JQL**: Execute consultas JQL com validação em tempo real
- **Histórico de Consultas**: Mantenha um histórico das suas consultas mais utilizadas
- **Exportação de Resultados**: Exporte os resultados para CSV
- **Interface Moderna**: Interface responsiva e intuitiva
- **Exemplos Práticos**: Consultas JQL de exemplo para iniciantes
- **Validação de Conectividade**: Teste a conexão com sua instância Jira

## 🏗️ Arquitetura

### Frontend
- **React**: Biblioteca JavaScript para interfaces de usuário
- **React Router**: Roteamento de páginas
- **Tailwind CSS**: Framework CSS utilitário
- **Axios**: Cliente HTTP para requisições
- **React Hot Toast**: Sistema de notificações
- **Lucide React**: Ícones modernos

### Backend
- **Node.js**: Runtime JavaScript
- **Express.js**: Framework web
- **Helmet**: Middleware de segurança
- **CORS**: Controle de acesso entre origens
- **Rate Limiting**: Proteção contra abuso
- **Joi**: Validação de dados

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Conta no Jira Cloud
- Token de API do Jira

### 1. Clone o Repositório

```bash
git clone <url-do-repositorio>
cd jql-tester
```

### 2. Configuração do Backend

```bash
# Navegue para o diretório do backend
cd backend

# Instale as dependências
npm install

# Copie o arquivo de exemplo das variáveis de ambiente
copy .env.example .env

# Edite o arquivo .env com suas configurações
notepad .env
```

#### Configuração do arquivo .env

```env
# Porta do servidor (padrão: 5000)
PORT=5000

# URL do frontend para CORS (padrão: http://localhost:3000)
FRONTEND_URL=http://localhost:3000

# Configurações opcionais do Jira (podem ser configuradas via interface)
JIRA_DOMAIN=sua-empresa.atlassian.net
JIRA_EMAIL=seu-email@empresa.com
JIRA_TOKEN=seu-token-de-api
```

### 3. Configuração do Frontend

```bash
# Em um novo terminal, navegue para o diretório do frontend
cd frontend

# Instale as dependências
npm install
```

### 4. Executar a Aplicação

#### Iniciar o Backend

```bash
# No diretório backend
npm run dev
```

O servidor backend será iniciado em `http://localhost:5000`

#### Iniciar o Frontend

```bash
# No diretório frontend
npm start
```

O frontend será iniciado em `http://localhost:3000`

## 🔑 Configuração do Jira

### 1. Obter Token de API

1. Acesse [https://id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Clique em "Create API token"
3. Dê um nome descritivo para o token
4. Copie o token gerado (guarde-o em local seguro)

### 2. Configurar na Aplicação

1. Abra a aplicação em `http://localhost:3000`
2. Navegue para "Configurações"
3. Preencha os campos:
   - **Domínio Jira**: `sua-empresa.atlassian.net`
   - **Email**: Seu email da conta Atlassian
   - **Token de API**: O token gerado no passo anterior
4. Clique em "Testar Conexão" para verificar
5. Salve as configurações

## 📖 Como Usar

### 1. Configurar Credenciais
- Acesse a página "Configurações"
- Insira suas credenciais do Jira
- Teste a conexão

### 2. Executar Consultas JQL
- Navegue para "Consultas JQL"
- Digite sua consulta JQL no campo de texto
- Configure opções de paginação (opcional)
- Clique em "Executar Consulta"

### 3. Visualizar Resultados
- Os resultados aparecerão em uma tabela formatada
- Clique nos links para abrir issues no Jira
- Use o botão "Exportar CSV" para baixar os dados

### 4. Gerenciar Histórico
- Suas consultas são salvas automaticamente
- Acesse o histórico na lateral da página
- Clique em uma consulta para reutilizá-la

## 🔍 Exemplos de Consultas JQL

### Consultas Básicas

```jql
# Issues de um projeto específico
project = "PROJ"

# Issues criadas na última semana
created >= -1w

# Issues em status específico
status = "In Progress"

# Issues de alta prioridade
priority = High
```

### Consultas Amplas (Análises Organizacionais)

```jql
# Issues não atribuídos (backlog)
assignee is EMPTY

# Issues atribuídos a qualquer pessoa
assignee is not EMPTY

# Issues com mudança de status na última semana
status changed during (-1w, now())

# Issues em atraso
duedate <= now() AND status not in (Done, Resolved, Closed)

# Issues de múltiplos projetos
project in ("PROJ1", "PROJ2", "PROJ3")

# Issues com trabalho registrado recentemente
worklogDate >= -7d
```

### Consultas Avançadas

```jql
# Issues críticas não resolvidas
priority = Critical AND resolution = Unresolved

# Issues atualizadas recentemente por projeto
project = "PROJ" AND updated >= -3d ORDER BY updated DESC

# Issues sem responsável em projetos específicos
project in ("PROJ1", "PROJ2") AND assignee is EMPTY

# Issues com labels específicos
labels in ("urgent", "bug") AND status != Done
```

## 🛡️ Segurança

### Armazenamento de Credenciais
- As credenciais são armazenadas apenas no localStorage do navegador
- Nunca são enviadas para servidores externos
- Comunicação direta com a API oficial do Jira via HTTPS

### Boas Práticas
- Use tokens de API em vez de senhas
- Revogue tokens não utilizados
- Mantenha suas credenciais seguras
- Não compartilhe tokens de API

## 🔧 Scripts Disponíveis

### Backend

```bash
npm start          # Inicia o servidor em produção
npm run dev        # Inicia o servidor em desenvolvimento (com nodemon)
npm test           # Executa os testes (quando implementados)
```

### Frontend

```bash
npm start          # Inicia o servidor de desenvolvimento
npm run build      # Cria build de produção
npm test           # Executa os testes
npm run eject      # Remove dependência do Create React App (irreversível)
```

## 📁 Estrutura do Projeto

```
jql-tester/
├── backend/
│   ├── routes/
│   │   └── jira.js          # Rotas da API Jira
│   ├── .env.example         # Exemplo de variáveis de ambiente
│   ├── package.json         # Dependências do backend
│   └── server.js            # Servidor Express
├── frontend/
│   ├── public/
│   │   └── index.html       # HTML principal
│   ├── src/
│   │   ├── components/
│   │   │   └── Header.js    # Componente de cabeçalho
│   │   ├── contexts/
│   │   │   └── JiraContext.js # Context do Jira
│   │   ├── pages/
│   │   │   ├── About.js     # Página sobre
│   │   │   ├── Home.js      # Página inicial
│   │   │   ├── QueryTester.js # Página de consultas
│   │   │   └── Settings.js  # Página de configurações
│   │   ├── services/
│   │   │   └── api.js       # Serviços de API
│   │   ├── App.js           # Componente principal
│   │   ├── index.css        # Estilos globais
│   │   └── index.js         # Ponto de entrada
│   ├── package.json         # Dependências do frontend
│   ├── postcss.config.js    # Configuração PostCSS
│   └── tailwind.config.js   # Configuração Tailwind
└── README.md                # Este arquivo
```

## 🐛 Solução de Problemas

### Erro de Conexão com Jira
- Verifique se o domínio está correto (sem https://)
- Confirme se o email e token estão corretos
- Verifique se você tem permissões no projeto Jira
- Teste a conectividade na página de configurações

### Erro de CORS
- Certifique-se de que o backend está rodando
- Verifique a configuração FRONTEND_URL no .env
- Confirme se as portas estão corretas

### Consulta JQL Inválida
- Verifique a sintaxe da consulta
- Confirme se os campos existem no seu Jira
- Use a documentação oficial para referência

## 📚 Recursos Úteis

- [Documentação JQL Oficial](https://support.atlassian.com/jira-software-cloud/docs/use-advanced-search-with-jira-query-language-jql/)
- [Jira REST API v3](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- [Gerar Token de API](https://id.atlassian.com/manage-profile/security/api-tokens)
- [Guia de Campos JQL](https://support.atlassian.com/jira-software-cloud/docs/jql-fields/)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature
3. Fazer commit das mudanças
4. Fazer push para a branch
5. Abrir um Pull Request

---

**Desenvolvido com ❤️ para a comunidade Jira**