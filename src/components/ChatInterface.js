import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, X, Heart, Settings, Zap, Key } from 'lucide-react';
import aiChatService from '../services/AIChatService';
import './ChatInterface.css';

const ChatInterface = ({ mood, stats, isOpen, onToggle }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [chatStats, setChatStats] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // ============================================
  // INICIALIZACIÓN Y CONFIGURACIÓN
  // ============================================

  useEffect(() => {
    // Verificar si ya está configurado
    const configured = aiChatService.isConfigured();
    setIsConfigured(configured);
    
    if (configured) {
      loadChatStats();
    }
    
    // Cargar API key si existe
    const savedKey = localStorage.getItem('groq_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (messages.length === 0) {
        showWelcomeMessage();
      }
      
      // Focus en input después de abrir
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, isConfigured]);

  // Auto-scroll al final
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatStats = () => {
    const stats = aiChatService.getConversationStats();
    setChatStats(stats);
  };

  // ============================================
  // MENSAJES DE BIENVENIDA
  // ============================================

  const showWelcomeMessage = () => {
    let welcomeMessage;
    let welcomeSuggestions;

    if (isConfigured) {
      const welcomeMessages = [
        "¡Annyeong, Mikasa! 😸 ¡Tu Michi está aquí con IA real! ¿Cómo te sientes hoy, mi amor?",
        "¡Miau miau! 🐱 ¡Ya tengo mi cerebrito IA activado! Cuéntame todo sobre tu día, MiChosa 💕",
        "¡Hola mi humana favorita! ✨ Ahora puedo chatear contigo de verdad con Groq. ¿Qué quieres que hablemos?",
        "¡MiMikasita! 😻 ¡Tu gatito ya está súper inteligente! Pregúntame lo que quieras o cuéntame tus secretos 🌸"
      ];
      
      welcomeMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
      welcomeSuggestions = ['¡Hola Michi!', '¿Cómo estás?', 'Te extrañé', 'Cuéntame algo lindo'];
    } else {
      welcomeMessage = "¡Hola Mikasa! 🐱 Para que pueda ser tu gato IA súper inteligente, necesito que configures mi cerebrito con Groq (es gratis). ¡Haz clic en ⚙️ Configuración!";
      welcomeSuggestions = ['⚙️ Configurar IA', '¿Qué es Groq?', 'Ayuda'];
    }

    setMessages([{
      type: 'bot',
      content: welcomeMessage,
      timestamp: Date.now(),
      isWelcome: true
    }]);

    setSuggestions(welcomeSuggestions);
  };

  // ============================================
  // CONFIGURACIÓN DE GROQ
  // ============================================

  const saveApiConfiguration = async () => {
    if (!apiKey.trim()) {
      alert('¡Por favor ingresa tu API key de Groq! 🔑');
      return;
    }

    if (!apiKey.startsWith('gsk_')) {
      alert('🚨 La API key de Groq debe empezar con "gsk_". ¿Estás segura que es correcta?');
      return;
    }

    try {
      // Mostrar mensaje de prueba
      setMessages(prev => [...prev, {
        type: 'bot',
        content: '🔧 Configurando tu IA... Dame un segundito para probar la conexión...',
        timestamp: Date.now()
      }]);

      // Configurar y probar
      aiChatService.setApiKey(apiKey);
      
      // Hacer una prueba rápida
      const testResponse = await aiChatService.sendMessage(
        'Hola, ¿funcionas correctamente?', 
        'neutral', 
        { energia: 50, carino: 50 }
      );

      setIsConfigured(true);
      setShowSettings(false);
      loadChatStats();
      
      // Mensaje de éxito
      setMessages(prev => [...prev, {
        type: 'bot',
        content: `¡PERFECTO! 🎉 Mi IA está funcionando. ${testResponse.response}`,
        timestamp: Date.now(),
        isWelcome: true
      }]);

      setSuggestions(['¡Genial!', 'Probemos más', '¿Qué puedes hacer?', 'Te amo Michi']);

    } catch (error) {
      console.error('Error configurando IA:', error);
      
      let errorMessage = '❌ Hubo un problema configurando la IA. ';
      
      if (error.message.includes('401')) {
        errorMessage += 'Tu API key parece incorrecta. ¿Puedes verificarla?';
      } else if (error.message.includes('429')) {
        errorMessage += 'Has excedido el límite de Groq. Espera un poco e intenta de nuevo.';
      } else {
        errorMessage += 'Verifica tu conexión a internet y que la API key sea correcta.';
      }

      setMessages(prev => [...prev, {
        type: 'bot',
        content: errorMessage,
        timestamp: Date.now(),
        isError: true
      }]);
    }
  };

  // ============================================
  // ENVÍO DE MENSAJES
  // ============================================

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: 'user',
      content: inputMessage.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      if (!isConfigured) {
        throw new Error('IA no configurada');
      }

      // Simular delay más realista (Groq es rápido pero no instantáneo)
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500));

      // Enviar a Groq
      const aiResponse = await aiChatService.sendMessage(
        userMessage.content, 
        mood, 
        stats
      );
      
      const botMessage = {
        type: 'bot',
        content: aiResponse.response,
        timestamp: Date.now(),
        mood: aiResponse.mood,
        provider: 'groq'
      };

      setMessages(prev => [...prev, botMessage]);
      setSuggestions(aiResponse.suggestions);
      loadChatStats();

    } catch (error) {
      console.error('Error en chat IA:', error);
      
      let errorMessage;
      
      if (!isConfigured) {
        errorMessage = '🔧 Necesito que configures mi IA primero. ¡Ve a Configuración!';
      } else if (error.message.includes('429')) {
        errorMessage = '⏰ ¡Ups! Estoy muy popular hoy. Esperemos un ratito antes del próximo mensaje 😸';
      } else if (error.message.includes('401')) {
        errorMessage = '🔑 Parece que mi API key tiene problemas. ¿Puedes verificarla en Configuración?';
      } else {
        errorMessage = '😿 Mi cerebrito IA tuvo un problemita. ¿Intentamos de nuevo en un ratito?';
      }
      
      const errorMsg = {
        type: 'bot',
        content: errorMessage,
        timestamp: Date.now(),
        isError: true
      };

      setMessages(prev => [...prev, errorMsg]);
      
      if (!isConfigured) {
        setSuggestions(['⚙️ Configurar IA', 'Ayuda']);
      } else {
        setSuggestions(['Reintentar', 'Está bien', 'Verificar configuración']);
      }
    }
    
    setIsTyping(false);
  };

  // ============================================
  // MANEJO DE EVENTOS
  // ============================================

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const selectSuggestion = (suggestion) => {
    if (suggestion === '⚙️ Configurar IA') {
      setShowSettings(true);
    } else if (suggestion === '¿Qué es Groq?') {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: '🤖 ¡Groq es una IA súper rápida y GRATIS! Es como darme un cerebrito inteligente para chatear contigo de verdad. ¡Solo necesitas una API key gratis de console.groq.com! 😸',
        timestamp: Date.now()
      }]);
    } else if (suggestion === 'Ayuda') {
      setShowSettings(true);
    } else if (suggestion === 'Reintentar') {
      sendMessage();
    } else if (suggestion === 'Verificar configuración') {
      setShowSettings(true);
    } else {
      setInputMessage(suggestion);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    if (window.confirm('¿Segura que quieres borrar toda nuestra conversación? 🥺 No podremos recordar lo que hablamos...')) {
      setMessages([]);
      setSuggestions([]);
      aiChatService.clearHistory();
      showWelcomeMessage();
    }
  };

  // ============================================
  // COMPONENTES UI
  // ============================================

  const SettingsPanel = () => (
    <motion.div
      className="settings-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="settings-header">
        <h3>⚙️ Configurar IA Groq</h3>
        <button onClick={() => setShowSettings(false)} className="close-settings">×</button>
      </div>
      
      <div className="settings-content">
        <div className="groq-info">
          <div className="info-box groq">
            <h4>🚀 Groq - IA Rápida y Gratis</h4>
            <p>• ✅ Completamente GRATIS</p>
            <p>• ⚡ Súper rápido (más que ChatGPT)</p>
            <p>• 🧠 Modelo Llama3 (muy inteligente)</p>
            <p>• 🔒 No usa tus datos para entrenar</p>
          </div>
        </div>

        <div className="setup-steps">
          <h4>📋 Pasos para obtener tu API Key:</h4>
          <ol>
            <li>Ve a: <a href="https://console.groq.com/" target="_blank" rel="noopener noreferrer">console.groq.com</a></li>
            <li>Crea cuenta gratis con tu email</li>
            <li>Ve a "API Keys" en el menú</li>
            <li>Haz clic en "Create API Key"</li>
            <li>Copia la key (empieza con "gsk_")</li>
            <li>Pégala aquí abajo 👇</li>
          </ol>
        </div>

        <div className="api-key-input">
          <label>🔑 Tu API Key de Groq:</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="gsk_..."
            className="api-input"
          />
          <small>La key empieza con "gsk_" y es completamente gratis 💕</small>
        </div>

        <div className="settings-actions">
          <button onClick={saveApiConfiguration} className="save-config-btn">
            <Key size={16} />
            Configurar mi IA
          </button>
        </div>

        <div className="help-note">
          <p>🆘 <strong>¿Necesitas ayuda?</strong></p>
          <p>Groq es 100% gratis y no requiere tarjeta de crédito. Si tienes problemas, verifica que hayas copiado toda la API key completa.</p>
        </div>
      </div>
    </motion.div>
  );

  const getCatMoodEmoji = () => {
    if (!isConfigured) return '🔧';
    
    switch (mood) {
      case 'superFeliz': return '😻';
      case 'feliz': return '😸';
      case 'neutro': return '🤖';
      case 'triste': return '😿';
      case 'muySad': return '😾';
      default: return '🤖';
    }
  };

  const getMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // ============================================
  // RENDER PRINCIPAL
  // ============================================

  if (!isOpen) {
    return (
      <motion.button
        className="chat-toggle-btn"
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <MessageCircle size={24} />
        <span className="chat-toggle-text">
          {isConfigured ? 'Chat IA 🤖' : 'Configurar IA ⚙️'}
        </span>
        {chatStats && chatStats.totalMessages > 0 && (
          <div className="chat-notification">
            {chatStats.totalMessages}
          </div>
        )}
      </motion.button>
    );
  }

  return (
    <motion.div
      className="chat-interface"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Header del chat */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="cat-avatar">
            <span className="cat-emoji">{getCatMoodEmoji()}</span>
            <div className={`online-indicator ${isConfigured ? 'ai-enabled' : 'ai-disabled'}`}></div>
          </div>
          <div className="chat-title">
            <h3>Michi {isConfigured ? '🤖' : '⚙️'}</h3>
            <span className="chat-status">
              {isTyping ? 'Pensando con Groq...' : 
               isConfigured ? 'IA Groq activa 🚀' : 'IA sin configurar'} 
            </span>
          </div>
        </div>
        
        <div className="chat-controls">
          {chatStats && isConfigured && (
            <div className="chat-stats" title="Mensajes totales">
              <Zap size={16} />
              <span>{chatStats.totalMessages}</span>
            </div>
          )}
          <button 
            className="settings-btn"
            onClick={() => setShowSettings(true)}
            title="Configurar Groq IA"
          >
            <Settings size={18} />
          </button>
          <button 
            className="chat-clear-btn"
            onClick={clearChat}
            title="Limpiar conversación"
            disabled={messages.length === 0}
          >
            🗑️
          </button>
          <button 
            className="chat-close-btn"
            onClick={onToggle}
            title="Cerrar chat"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Panel de configuración */}
      <AnimatePresence>
        {showSettings && <SettingsPanel />}
      </AnimatePresence>

      {/* Área de mensajes */}
      <div className="chat-messages">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              className={`message ${message.type} ${message.isWelcome ? 'welcome' : ''} ${message.isError ? 'error' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {message.type === 'bot' && (
                <div className="message-avatar">
                  <span>{isConfigured ? '🤖' : '🐱'}</span>
                </div>
              )}
              
              <div className="message-content">
                <div className="message-text">
                  {message.content.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
                <div className="message-time">
                  {getMessageTime(message.timestamp)}
                  {message.provider && message.provider === 'groq' && (
                    <span className="provider-badge groq">Groq</span>
                  )}
                </div>
              </div>

              {message.type === 'user' && (
                <div className="message-avatar user-avatar">
                  <Heart size={14} />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Indicador de escritura mejorado */}
        {isTyping && (
          <motion.div
            className="typing-indicator"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="message-avatar">
              <span>🤖</span>
            </div>
            <div className="typing-bubbles ai-typing">
              <div className="typing-bubble"></div>
              <div className="typing-bubble"></div>
              <div className="typing-bubble"></div>
              <span className="ai-thinking">Groq procesando...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Sugerencias */}
      {suggestions.length > 0 && !isTyping && !showSettings && (
        <motion.div
          className="chat-suggestions"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className={`suggestion-btn ${suggestion.includes('⚙️') ? 'config-suggestion' : ''}`}
              onClick={() => selectSuggestion(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </motion.div>
      )}

      {/* Área de entrada */}
      <div className="chat-input-area">
        <div className="chat-input-container">
          <textarea
            ref={inputRef}
            className="chat-input"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              isConfigured 
                ? "Escríbele algo a Michi con IA real... 💕" 
                : "Configura Groq IA primero ⚙️"
            }
            rows={1}
            disabled={isTyping}
          />
          <button
            className={`chat-send-btn ${inputMessage.trim() && isConfigured ? 'active' : ''}`}
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isTyping || !isConfigured}
            title={isConfigured ? 'Enviar mensaje' : 'Configura IA primero'}
          >
            {isConfigured ? <Send size={18} /> : <Settings size={18} />}
          </button>
        </div>

        {/* Botones de acción rápida */}
        <div className="quick-actions">
          <button
            className="quick-action-btn"
            onClick={() => selectSuggestion('¿Cómo estás hoy, Michi?')}
            disabled={!isConfigured}
            title={!isConfigured ? 'Configura IA primero' : ''}
          >
            😊 Saludar
          </button>
          <button
            className="quick-action-btn"
            onClick={() => selectSuggestion('Te amo mucho Michi')}
            disabled={!isConfigured}
            title={!isConfigured ? 'Configura IA primero' : ''}
          >
            💕 Cariño
          </button>
          <button
            className="quick-action-btn"
            onClick={() => selectSuggestion('Estoy triste, necesito apoyo')}
            disabled={!isConfigured}
            title={!isConfigured ? 'Configura IA primero' : ''}
          >
            🫂 Apoyo
          </button>
          <button
            className="quick-action-btn"
            onClick={() => selectSuggestion('Recomiéndame un K-drama bueno')}
            disabled={!isConfigured}
            title={!isConfigured ? 'Configura IA primero' : ''}
          >
            📺 K-drama
          </button>
          {!isConfigured && (
            <button
              className="quick-action-btn config-btn-main"
              onClick={() => setShowSettings(true)}
            >
              ⚙️ Configurar Groq
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatInterface;