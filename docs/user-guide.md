# Guia do Usuário - JQL Tester

## Introdução

O JQL Tester é uma ferramenta web intuitiva que permite testar e executar consultas JQL (Jira Query Language) de forma rápida e eficiente. Esta aplicação oferece uma interface amigável para interagir com sua instância do Jira Cloud, validar consultas e visualizar resultados de forma organizada.

## Primeiros Passos

### 1. Acessando a Aplicação

1. Abra seu navegador web
2. Acesse: `http://localhost:3000` (ou o endereço configurado)
3. Você verá a página inicial do JQL Tester

### 2. Configuração Inicial

Antes de usar a aplicação, você precisa configurar sua conexão com o Jira Cloud.

#### Informações Necessárias

- **URL do Jira Cloud**: Endereço da sua instância (ex: https://minhaempresa.atlassian.net)
- **Email**: Seu email de login no Jira
- **Token de API**: Token gerado em sua conta Atlassian

#### Como Obter um Token de API

1. Acesse: https://id.atlassian.com/manage-profile/security/api-tokens
2. Faça login com sua conta Atlassian
3. Clique em "Create API token"
4. Digite um nome descritivo (ex: "JQL Tester")
5. Clique em "Create"
6. **Importante**: Copie o token imediatamente (não será mostrado novamente)

## Interface da Aplicação

### Navegação Principal

A aplicação possui quatro seções principais:

1. **Home** - Página inicial com visão geral
2. **Consultas** - Interface para executar consultas JQL
3. **Configurações** - Configuração da conexão com Jira
4. **Sobre** - Informações sobre a aplicação

### Indicadores de Status

- **🟢 Conectado**: Conexão ativa com o Jira
- **🟡 Desconectado**: Necessário configurar conexão
- **🔴 Erro**: Problema na conexão ou configuração

## Configurando a Conexão

### Passo a Passo

1. **Acessar Configurações**
   - Clique em "Configurações" no menu principal
   - Ou clique em "Configurar Conexão" na página inicial

2. **Preencher Credenciais**
   
   **URL do Jira Cloud:**
   - Digite a URL completa da sua instância
   - Formato: `https://sua-empresa.atlassian.net`
   - ✅ Correto: `https://minhaempresa.atlassian.net`
   - ❌ Incorreto: `minhaempresa.atlassian.net` (sem https://)
   
   **Email:**
   - Use o mesmo email do seu login no Jira
   - Deve ser um email válido
   
   **Token de API:**
   - Cole o token gerado anteriormente
   - Use o botão 👁️ para mostrar/ocultar o token

3. **Salvar e Testar**
   - Clique em "Salvar Configurações"
   - Clique em "Testar Conexão"
   - Aguarde a confirmação de sucesso

### Solução de Problemas na Configuração

#### Erro: "URL deve estar no formato: https://empresa.atlassian.net"
- Verifique se a URL começa com `https://`
- Verifique se termina com `.atlassian.net`
- Não inclua barras extras no final

#### Erro: "Credenciais inválidas"
- Verifique se o email está correto
- Verifique se o token não expirou
- Gere um novo token se necessário

#### Erro: "Instância do Jira não encontrada"
- Verifique se a URL da instância está correta
- Confirme se a instância está ativa

## Executando Consultas JQL

### Acessando o Editor de Consultas

1. Clique em "Consultas" no menu principal
2. Ou clique em "Executar Consultas JQL" na página inicial (se conectado)

### Interface do Editor

O editor de consultas possui:

- **Campo de Consulta**: Área de texto para digitar a consulta JQL
- **Botão Executar**: Executa a consulta atual
- **Histórico**: Lista das consultas executadas anteriormente
- **Resultados**: Área onde os resultados são exibidos

### Escrevendo Consultas JQL

#### Sintaxe Básica

```jql
campo operador valor
```

#### Exemplos de Consultas

**1. Buscar por Projeto**
```jql
project = "PROJ"
```

**2. Buscar por Status**
```jql
status = "In Progress"
```

**3. Combinar Condições**
```jql
project = "PROJ" AND status = "In Progress"
```

**4. Buscar por Assignee**
```jql
assignee = "joao.silva@empresa.com"
```

**5. Issues Criadas Recentemente**
```jql
created >= -7d
```

**6. Issues de Alta Prioridade**
```jql
priority = High
```

**7. Consulta Complexa**
```jql
project = "PROJ" AND status IN ("To Do", "In Progress") AND priority = High AND assignee is not EMPTY
```

#### Operadores Comuns

| Operador | Descrição | Exemplo |
|----------|-----------|----------|
| `=` | Igual a | `status = "Done"` |
| `!=` | Diferente de | `status != "Done"` |
| `IN` | Está em lista | `status IN ("To Do", "In Progress")` |
| `NOT IN` | Não está em lista | `status NOT IN ("Done", "Cancelled")` |
| `>` | Maior que | `created > "2024-01-01"` |
| `>=` | Maior ou igual | `created >= -30d` |
| `<` | Menor que | `created < "2024-01-01"` |
| `<=` | Menor ou igual | `created <= -7d` |
| `~` | Contém | `summary ~ "bug"` |
| `!~` | Não contém | `summary !~ "test"` |
| `IS` | É (para valores especiais) | `assignee IS EMPTY` |
| `IS NOT` | Não é | `assignee IS NOT EMPTY` |

#### Conectores Lógicos

| Conector | Descrição | Exemplo |
|----------|-----------|----------|
| `AND` | E lógico | `project = "PROJ" AND status = "Done"` |
| `OR` | Ou lógico | `priority = High OR priority = Critical` |
| `NOT` | Negação | `NOT status = "Done"` |

#### Campos Comuns

| Campo | Descrição | Exemplo |
|-------|-----------|----------|
| `project` | Projeto | `project = "MYPROJ"` |
| `status` | Status da issue | `status = "In Progress"` |
| `priority` | Prioridade | `priority = High` |
| `assignee` | Responsável | `assignee = "user@email.com"` |
| `reporter` | Criador | `reporter = "user@email.com"` |
| `summary` | Título/Resumo | `summary ~ "bug"` |
| `description` | Descrição | `description ~ "error"` |
| `created` | Data de criação | `created >= -30d` |
| `updated` | Data de atualização | `updated >= -7d` |
| `resolved` | Data de resolução | `resolved >= -30d` |
| `type` | Tipo de issue | `type = Bug` |
| `component` | Componente | `component = "Frontend"` |
| `version` | Versão | `version = "1.0.0"` |

### Executando uma Consulta

1. **Digite a Consulta**
   - Escreva sua consulta JQL no campo de texto
   - Use os exemplos acima como referência

2. **Executar**
   - Clique no botão "Executar Consulta"
   - Aguarde o processamento (indicado por "Executando...")

3. **Visualizar Resultados**
   - Os resultados aparecerão abaixo do editor
   - Cada issue mostra: chave, título, status, responsável

### Interpretando os Resultados

#### Cabeçalho dos Resultados
- **Total de Resultados**: Número total de issues encontradas
- **Página Atual**: Resultados sendo exibidos (ex: 1-50 de 150)
- **Tempo de Execução**: Tempo que a consulta levou para executar

#### Informações de Cada Issue
- **Chave**: Identificador único (ex: PROJ-123)
- **Título**: Resumo da issue
- **Status**: Status atual (To Do, In Progress, Done, etc.)
- **Responsável**: Pessoa atribuída à issue
- **Prioridade**: Nível de prioridade
- **Tipo**: Tipo da issue (Bug, Story, Task, etc.)

#### Ações Disponíveis
- **Ver no Jira**: Link direto para a issue no Jira
- **Copiar Chave**: Copia a chave da issue

## Histórico de Consultas

### Visualizando o Histórico

O histórico de consultas é exibido em duas localizações:

1. **Página Inicial**: Últimas 5 consultas executadas
2. **Página de Consultas**: Histórico completo na barra lateral

### Informações do Histórico

Para cada consulta no histórico, você verá:
- **Consulta JQL**: O texto da consulta executada
- **Data/Hora**: Quando foi executada
- **Resultados**: Número de issues encontradas
- **Status**: Se foi bem-sucedida ou teve erro

### Reutilizando Consultas

1. **Da Página Inicial**:
   - Clique em "Executar" ao lado da consulta desejada

2. **Da Página de Consultas**:
   - Clique na consulta no histórico
   - A consulta será carregada no editor
   - Clique em "Executar" para executar novamente

### Limpando o Histórico

- O histórico é armazenado localmente no seu navegador
- Para limpar: vá em Configurações → "Limpar Histórico"
- Ou limpe os dados do site no navegador

## Funcionalidades Avançadas

### Paginação de Resultados

Quando uma consulta retorna muitos resultados:

1. **Navegação por Páginas**
   - Use os botões "Anterior" e "Próxima"
   - Ou digite o número da página desejada

2. **Configurar Itens por Página**
   - Padrão: 50 resultados por página
   - Máximo: 100 resultados por página

### Exportação de Resultados

1. **Copiar Resultados**
   - Clique em "Copiar" para copiar os resultados
   - Formato: texto separado por tabs

2. **Exportar CSV**
   - Clique em "Exportar CSV"
   - Arquivo será baixado automaticamente

### Filtros Rápidos

Use os filtros pré-definidos para consultas comuns:

- **Minhas Issues**: `assignee = currentUser()`
- **Issues Abertas**: `status NOT IN (Done, Cancelled)`
- **Criadas Hoje**: `created >= startOfDay()`
- **Atualizadas Recentemente**: `updated >= -24h`

## Dicas e Melhores Práticas

### Escrevendo Consultas Eficientes

1. **Use Filtros Específicos**
   - ✅ `project = "PROJ" AND status = "In Progress"`
   - ❌ `status = "In Progress"` (muito amplo)

2. **Limite o Escopo Temporal**
   - ✅ `created >= -30d`
   - ❌ `created > "2020-01-01"` (muito amplo)

3. **Use Campos Indexados**
   - Campos como `project`, `status`, `assignee` são mais rápidos
   - Evite muitas consultas em campos de texto livre

### Validação de Consultas

1. **Teste com Dados Pequenos**
   - Comece com filtros restritivos
   - Expanda gradualmente

2. **Verifique a Sintaxe**
   - Use parênteses para agrupar condições complexas
   - Exemplo: `(priority = High OR priority = Critical) AND status != Done`

3. **Cuidado com Performance**
   - Consultas muito amplas podem ser lentas
   - O Jira pode limitar resultados automaticamente

### Campos Customizados

Para usar campos customizados:

1. **Identificar o Campo**
   - Vá em Configurações → "Carregar Campos"
   - Encontre o ID do campo (ex: `customfield_10001`)

2. **Usar na Consulta**
   ```jql
   "Story Points" > 5
   # ou
   customfield_10001 > 5
   ```

## Solução de Problemas

### Problemas Comuns

#### "Consulta JQL inválida"

**Possíveis Causas:**
- Sintaxe incorreta
- Campo inexistente
- Valor inválido para o campo
- Operador incompatível

**Soluções:**
1. Verifique a sintaxe da consulta
2. Confirme se os campos existem no seu Jira
3. Use aspas para valores com espaços
4. Consulte a documentação JQL do Atlassian

#### "Sem permissão para executar esta consulta"

**Possíveis Causas:**
- Falta de permissão no projeto
- Campo restrito
- Configuração de segurança

**Soluções:**
1. Verifique suas permissões no Jira
2. Contate o administrador do Jira
3. Use campos e projetos aos quais tem acesso

#### "Erro de conexão com o servidor"

**Possíveis Causas:**
- Backend não está rodando
- Problema de rede
- Firewall bloqueando

**Soluções:**
1. Verifique se o backend está ativo
2. Teste a conectividade de rede
3. Verifique configurações de proxy/firewall

#### "Credenciais inválidas"

**Possíveis Causas:**
- Token expirado
- Email incorreto
- Token inválido

**Soluções:**
1. Gere um novo token de API
2. Verifique se o email está correto
3. Teste as credenciais diretamente no Jira

### Limpeza de Dados

Se a aplicação estiver com comportamento estranho:

1. **Limpar Cache do Navegador**
   - Ctrl+Shift+Delete (Windows/Linux)
   - Cmd+Shift+Delete (Mac)

2. **Limpar Dados Locais**
   - F12 → Application → Local Storage
   - Deletar dados do site

3. **Recarregar Aplicação**
   - F5 ou Ctrl+F5 para recarregar

## Exemplos Práticos

### Cenário 1: Relatório de Sprint

**Objetivo**: Ver todas as issues do sprint atual

```jql
project = "MYPROJ" AND sprint in openSprints()
```

### Cenário 2: Issues Atrasadas

**Objetivo**: Issues que passaram da data de entrega

```jql
due < now() AND status != Done
```

### Cenário 3: Bugs Críticos

**Objetivo**: Todos os bugs de alta prioridade não resolvidos

```jql
type = Bug AND priority IN (High, Critical) AND status != Done
```

### Cenário 4: Trabalho da Equipe

**Objetivo**: Issues atribuídas à minha equipe

```jql
assignee IN ("user1@email.com", "user2@email.com", "user3@email.com") AND status != Done
```

### Cenário 5: Análise de Produtividade

**Objetivo**: Issues resolvidas na última semana

```jql
resolved >= -7d AND resolved <= now()
```

## Recursos Adicionais

### Documentação Oficial

- **JQL Reference**: https://support.atlassian.com/jira-software-cloud/docs/advanced-search-reference-jql-fields/
- **JQL Functions**: https://support.atlassian.com/jira-software-cloud/docs/advanced-search-reference-jql-functions/
- **Jira REST API**: https://developer.atlassian.com/cloud/jira/platform/rest/v3/

### Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `Ctrl+Enter` | Executar consulta |
| `Ctrl+L` | Limpar editor |
| `Ctrl+H` | Mostrar/ocultar histórico |
| `F1` | Ajuda |

### Dicas de Produtividade

1. **Salve Consultas Frequentes**
   - Use o histórico para reutilizar consultas
   - Crie um documento com suas consultas favoritas

2. **Use Filtros do Jira**
   - Crie filtros salvos no Jira
   - Reference-os nas consultas: `filter = "Meu Filtro"`

3. **Combine com Dashboards**
   - Use os resultados para criar dashboards no Jira
   - Exporte dados para análises externas

---

**Nota**: Este guia cobre as funcionalidades principais do JQL Tester. Para funcionalidades específicas do Jira ou consultas JQL avançadas, consulte a documentação oficial do Atlassian.