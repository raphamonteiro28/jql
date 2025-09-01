import React from 'react';
import './PasswordStrength.css';

const PasswordStrength = ({ password, showStrength = true }) => {
  // Função para calcular a força da senha
  const calculateStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[^\w\s]/.test(password)
    };
    
    // Pontuação baseada nos critérios
    if (checks.length) score += 1;
    if (checks.lowercase) score += 1;
    if (checks.uppercase) score += 1;
    if (checks.numbers) score += 1;
    if (checks.symbols) score += 1;
    
    // Bônus para senhas mais longas
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    
    // Determinar força e cor
    let label, color;
    if (score <= 2) {
      label = 'Fraca';
      color = '#ff4757';
    } else if (score <= 4) {
      label = 'Média';
      color = '#ffa502';
    } else if (score <= 5) {
      label = 'Forte';
      color = '#2ed573';
    } else {
      label = 'Muito Forte';
      color = '#1e90ff';
    }
    
    return { score, label, color, checks };
  };
  
  const strength = calculateStrength(password);
  
  if (!showStrength || !password) {
    return null;
  }
  
  return (
    <div className="password-strength">
      <div className="strength-bar">
        <div 
          className="strength-fill"
          style={{
            width: `${(strength.score / 7) * 100}%`,
            backgroundColor: strength.color
          }}
        />
      </div>
      
      <div className="strength-info">
        <span 
          className="strength-label"
          style={{ color: strength.color }}
        >
          Força: {strength.label}
        </span>
      </div>
      
      <div className="strength-requirements">
        <div className="requirement-item">
          <span className={strength.checks.length ? 'check-pass' : 'check-fail'}>
            {strength.checks.length ? '✓' : '✗'}
          </span>
          <span>Pelo menos 8 caracteres</span>
        </div>
        
        <div className="requirement-item">
          <span className={strength.checks.lowercase ? 'check-pass' : 'check-fail'}>
            {strength.checks.lowercase ? '✓' : '✗'}
          </span>
          <span>Letra minúscula</span>
        </div>
        
        <div className="requirement-item">
          <span className={strength.checks.uppercase ? 'check-pass' : 'check-fail'}>
            {strength.checks.uppercase ? '✓' : '✗'}
          </span>
          <span>Letra maiúscula</span>
        </div>
        
        <div className="requirement-item">
          <span className={strength.checks.numbers ? 'check-pass' : 'check-fail'}>
            {strength.checks.numbers ? '✓' : '✗'}
          </span>
          <span>Número</span>
        </div>
        
        <div className="requirement-item">
          <span className={strength.checks.symbols ? 'check-pass' : 'check-fail'}>
            {strength.checks.symbols ? '✓' : '✗'}
          </span>
          <span>Símbolo especial</span>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrength;