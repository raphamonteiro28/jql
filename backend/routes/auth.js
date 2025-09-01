const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Chave secreta para JWT (em produção, use uma variável de ambiente)
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-super-segura-aqui';

// Simulação de banco de dados em memória (em produção, use um banco real)
const users = [];

// Função para encontrar usuário por email
const findUserByEmail = (email) => {
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

// Função para criar um novo usuário
const createUser = async (name, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: Date.now().toString(),
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };
  users.push(user);
  return user;
};

// Função para validar senha
const validatePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Middleware para validar JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token de acesso requerido'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token inválido ou expirado'
      });
    }
    
    // Adicionar informações do usuário e Jira ao request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      jiraUrl: user.jiraUrl,
      jiraToken: user.jiraToken
    };
    next();
  });
};

// Rota de registro
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validação básica
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Nome, email e senha são obrigatórios' 
      });
    }
    
    // Verifica se o usuário já existe
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Usuário já existe com este email' 
      });
    }
    
    // Validação de senha
    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'A senha deve ter pelo menos 6 caracteres' 
      });
    }
    
    // Cria o novo usuário
    const user = await createUser(name, email, password);
    
    // Gera o token JWT
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'Usuário criado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota de login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validação básica
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email e senha são obrigatórios' 
      });
    }
    
    // Busca o usuário
    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        message: 'Credenciais inválidas' 
      });
    }
    
    // Valida a senha
    const isValidPassword = await validatePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Credenciais inválidas' 
      });
    }
    
    // Gera o token JWT
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});



// Rota para verificar se o token é válido
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Token válido',
    user: req.user
  });
});



// Rota para logout (opcional - principalmente para invalidar token no frontend)
router.post('/logout', authenticateToken, (req, res) => {
  // Em um sistema real, você poderia adicionar o token a uma blacklist
  res.json({
    success: true,
    message: 'Logout realizado com sucesso'
  });
});

module.exports = { router, authenticateToken };