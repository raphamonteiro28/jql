const express = require('express');
const axios = require('axios');
const Joi = require('joi');
const { requireAuth, logAuthActivity } = require('../middleware/auth');
const router = express.Router();

// Aplicar middleware de autenticação a todas as rotas
router.use(requireAuth);
router.use(logAuthActivity);

// Schema de validação para configuração do Jira
const jiraConfigSchema = Joi.object({
  domain: Joi.string().uri().required(),
  email: Joi.string().email().required(),
  token: Joi.string().required()
});

// Schema de validação para consulta JQL
const jqlQuerySchema = Joi.object({
  jql: Joi.string().required(),
  startAt: Joi.number().integer().min(0).default(0),
  maxResults: Joi.number().integer().min(1).max(100).default(50),
  fields: Joi.array().items(Joi.string()).default(['summary', 'status', 'assignee', 'created', 'updated'])
});

// Função para criar headers de autenticação
function createAuthHeaders(email, token) {
  const auth = Buffer.from(`${email}:${token}`).toString('base64');
  return {
    'Authorization': `Basic ${auth}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
}

// Endpoint para testar conexão com Jira
router.post('/test-connection', async (req, res) => {
  try {
    console.log('Tentativa de conexão recebida:', {
      domain: req.body.domain,
      email: req.body.email,
      tokenLength: req.body.token ? req.body.token.length : 0
    });
    
    // Validar dados de entrada
    const { error, value } = jiraConfigSchema.validate(req.body);
    if (error) {
      console.log('Erro de validação:', error.details);
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.details.map(d => d.message)
      });
    }

    const { domain, email, token } = value;
    const headers = createAuthHeaders(email, token);
    
    console.log('Fazendo requisição para:', `${domain}/rest/api/3/myself`);
    console.log('Headers de autenticação criados (sem token):', {
      'Accept': headers.Accept,
      'Content-Type': headers['Content-Type']
    });

    // Testar conexão fazendo uma requisição simples
    const response = await axios.get(`${domain}/rest/api/3/myself`, {
      headers,
      timeout: 10000
    });

    res.json({
      success: true,
      message: 'Conexão estabelecida com sucesso',
      user: {
        displayName: response.data.displayName,
        emailAddress: response.data.emailAddress,
        accountId: response.data.accountId
      }
    });
  } catch (error) {
    console.error('Erro ao testar conexão:', error.message);
    
    if (error.response) {
      const status = error.response.status;
      let message = 'Erro na conexão com Jira';
      
      switch (status) {
        case 401:
          message = 'Credenciais inválidas. Verifique email e token.';
          break;
        case 403:
          message = 'Acesso negado. Verifique as permissões do token.';
          break;
        case 404:
          message = 'Domínio Jira não encontrado. Verifique a URL.';
          break;
        default:
          message = `Erro HTTP ${status}: ${error.response.data?.message || 'Erro desconhecido'}`;
      }
      
      return res.status(400).json({ error: message });
    }
    
    res.status(500).json({
      error: 'Erro interno',
      message: 'Não foi possível conectar ao Jira'
    });
  }
});

// Endpoint para executar consulta JQL
router.post('/search', async (req, res) => {
  try {
    // Validar configuração do Jira
    const { error: configError, value: config } = jiraConfigSchema.validate({
      domain: req.body.domain,
      email: req.body.email,
      token: req.body.token
    });
    
    if (configError) {
      return res.status(400).json({
        error: 'Configuração Jira inválida',
        details: configError.details.map(d => d.message)
      });
    }

    // Validar consulta JQL
    const { error: queryError, value: query } = jqlQuerySchema.validate({
      jql: req.body.jql,
      startAt: req.body.startAt,
      maxResults: req.body.maxResults,
      fields: req.body.fields
    });
    
    if (queryError) {
      return res.status(400).json({
        error: 'Consulta JQL inválida',
        details: queryError.details.map(d => d.message)
      });
    }

    const { domain, email, token } = config;
    const { jql, startAt, maxResults, fields } = query;
    const headers = createAuthHeaders(email, token);

    // Executar consulta JQL
    const response = await axios.post(`${domain}/rest/api/3/search`, {
      jql,
      startAt,
      maxResults,
      fields
    }, {
      headers,
      timeout: 30000
    });

    // Processar e formatar resultados
    const results = {
      total: response.data.total,
      startAt: response.data.startAt,
      maxResults: response.data.maxResults,
      issues: response.data.issues.map(issue => ({
        key: issue.key,
        id: issue.id,
        self: issue.self,
        fields: issue.fields
      }))
    };

    res.json({
      success: true,
      query: jql,
      results
    });
  } catch (error) {
    console.error('Erro ao executar consulta JQL:', error.message);
    
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      let message = 'Erro na consulta JQL';
      let details = [];
      
      switch (status) {
        case 400:
          message = 'Consulta JQL inválida';
          if (errorData.errorMessages) {
            details = errorData.errorMessages;
          }
          break;
        case 401:
          message = 'Credenciais inválidas';
          break;
        case 403:
          message = 'Acesso negado para esta consulta';
          break;
        default:
          message = `Erro HTTP ${status}`;
          if (errorData.message) {
            details = [errorData.message];
          }
      }
      
      return res.status(400).json({ error: message, details });
    }
    
    res.status(500).json({
      error: 'Erro interno',
      message: 'Não foi possível executar a consulta'
    });
  }
});

// Endpoint para obter metadados de campos
router.post('/fields', async (req, res) => {
  try {
    const { error, value } = jiraConfigSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Configuração inválida',
        details: error.details.map(d => d.message)
      });
    }

    const { domain, email, token } = value;
    const headers = createAuthHeaders(email, token);

    const response = await axios.get(`${domain}/rest/api/3/field`, {
      headers,
      timeout: 10000
    });

    const fields = response.data.map(field => ({
      id: field.id,
      name: field.name,
      custom: field.custom,
      searchable: field.searchable,
      navigable: field.navigable
    }));

    res.json({ success: true, fields });
  } catch (error) {
    console.error('Erro ao obter campos:', error.message);
    res.status(500).json({
      error: 'Erro ao obter campos',
      message: error.message
    });
  }
});

module.exports = router;