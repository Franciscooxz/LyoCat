import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Heart, Eye, EyeOff } from 'lucide-react';
import './LoginScreen.css';

const LoginScreen = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Credenciales únicas del usuario (puedes cambiar estas)
  const VALID_CREDENTIALS = {
    username: 'Mikasa', // Cambia esto por tu usuario deseado
    password: 'LyoMikasa'   // Cambia esto por tu contraseña deseada
  };

  // Limpiar error cuando el usuario empiece a escribir
  useEffect(() => {
    if (credentials.username || credentials.password) {
      setError('');
    }
  }, [credentials]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simular delay de autenticación para mejor UX
    await new Promise(resolve => setTimeout(resolve, 800));

    // Validar credenciales
    if (
      credentials.username === VALID_CREDENTIALS.username &&
      credentials.password === VALID_CREDENTIALS.password
    ) {
      // Guardar sesión en localStorage
      localStorage.setItem('catTamagotchi_isLoggedIn', 'true');
      localStorage.setItem('catTamagotchi_username', credentials.username);
      localStorage.setItem('catTamagotchi_loginTime', Date.now().toString());
      
      // Llamar callback de éxito
      onLogin(credentials.username);
    } else {
      setError('잘못된 사용자명 또는 비밀번호입니다 / Usuario o contraseña incorrectos');
    }
    
    setIsLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      {/* Fondo decorativo coreano */}
      <div className="login-background">
        <div className="floating-element heart-1">💕</div>
        <div className="floating-element heart-2">🐱</div>
        <div className="floating-element heart-3">✨</div>
        <div className="floating-element heart-4">🌙</div>
        <div className="floating-element heart-5">💖</div>
      </div>

      <motion.div 
        className="login-card"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Header del login */}
        <div className="login-header">
          <motion.div 
            className="login-cat-icon"
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            🐱
          </motion.div>
          <h1 className="login-title">우정 다마고치</h1>
          <p className="login-subtitle">
            Friendship Tamagotchi<br />
            <span className="korean-text">당신의 고양이가 기다리고 있어요</span>
          </p>
        </div>

        {/* Formulario de login */}
        <motion.form 
          className="login-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Campo de usuario */}
          <div className="input-group">
            <label htmlFor="username" className="input-label">
              사용자명 / Usuario
            </label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                placeholder="Ingresa tu usuario"
                className="login-input"
                required
                autoComplete="username"
              />
            </div>
          </div>

          {/* Campo de contraseña */}
          <div className="input-group">
            <label htmlFor="password" className="input-label">
              비밀번호 / Contraseña
            </label>
            <div className="input-wrapper">
              <Heart className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="Ingresa tu contraseña"
                className="login-input"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <motion.div 
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}

          {/* Botón de login */}
          <motion.button
            type="submit"
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading || !credentials.username || !credentials.password}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                로그인 중... / Iniciando sesión...
              </div>
            ) : (
              <>
                <Lock className="button-icon" />
                들어가기 / Entrar
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Información de ayuda */}
        <motion.div 
          className="login-help"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="help-text">
            <span className="help-icon">💡</span>
            Tu progreso se guardará automáticamente
          </div>
          <div className="credentials-hint">
            <details>
              <summary>¿Olvidaste tus credenciales?</summary>
              <div className="hint-content">
                <p>Usuario: <code>catowner</code></p>
                <p>Contraseña: <code>meow2024</code></p>
                <small>Nota: Puedes cambiar estas credenciales en el código</small>
              </div>
            </details>
          </div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div 
        className="login-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <p>Made with 💕 for cat lovers</p>
        <p className="korean-footer">고양이를 사랑하는 사람들을 위해</p>
      </motion.div>
    </div>
  );
};

export default LoginScreen;