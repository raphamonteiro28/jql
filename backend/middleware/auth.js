const jwt = require('jsonwebtoken');

// Chave secreta para JWT (deve ser a mesma usada nas rotas de auth)
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-super-segura-aqui';

// Middleware para verificar autenticação
const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acesso requerido. Faça login para continuar.'
      });
    }

    // Verificar se o token é válido
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({
            success: false,
            message: 'Token expirado. Faça login novamente.',
            code: 'TOKEN_EXPIRED'
          });
        }
        
        if (err.name === 'JsonWebTokenError') {
          return res.status(403).json({
            success: false,
            message: 'Token inválido.',
            code: 'INVALID_TOKEN'
          });
        }
        
        return res.status(403).json({
          success: false,
          message: 'Erro na verificação do token.',
          code: 'TOKEN_ERROR'
        });
      }

      // Adicionar informações do usuário à requisição
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Middleware opcional - não bloqueia se não houver token
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      req.user = null;
      return next();
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        req.user = null;
      } else {
        req.user = decoded;
      }
      next();
    });
  } catch (error) {
    console.error('Erro no middleware de autenticação opcional:', error);
    req.user = null;
    next();
  }
};

// Middleware para verificar se o usuário tem permissões específicas
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autenticação requerida'
      });
    }

    // Se não há roles específicas, qualquer usuário autenticado pode acessar
    if (!roles || roles.length === 0) {
      return next();
    }

    // Verificar se o usuário tem uma das roles necessárias
    const userRoles = req.user.roles || [];
    const hasPermission = roles.some(role => userRoles.includes(role));

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Permissões insuficientes para acessar este recurso'
      });
    }

    next();
  };
};

// Middleware para log de atividades autenticadas
const logAuthActivity = (req, res, next) => {
  if (req.user) {
    console.log(`[${new Date().toISOString()}] Usuário ${req.user.email} (ID: ${req.user.id}) acessou ${req.method} ${req.originalUrl}`);
  }
  next();
};

module.exports = {
  requireAuth,
  optionalAuth,
  requireRole,
  logAuthActivity
};