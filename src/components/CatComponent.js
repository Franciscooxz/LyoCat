import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import catOrangeImage from '../images/cat-orange.png';
import personalMessagesSystem from '../services/PersonalMessagesSystem';
import './CatComponent.css';

const CatComponent = ({ mood, stats, darkMode, onClick }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageType, setMessageType] = useState('love'); // 'love', 'drama', 'personal'
  const [clickCount, setClickCount] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [lastPersonalMessageTime, setLastPersonalMessageTime] = useState(0);
  const catRef = useRef();

  // Mensajes de amor en coreano y español
    const loveMessages = [
    // :sparkling_heart: Mensajes de cariño y amistad
    "당신은 나의 가장 소중한 친구야! :two_hearts:",
    "Eres mi persona favorita en todo el mundo :star2:",
    "우리의 우정이 영원하길 바라 :sparkles:",
    "Tu amistad es mi tesoro más preciado :gem:",
    "언제나 내 마음속에 있어줘서 고마워 :gift_heart:",
    "Contigo la distancia no importa :cherry_blossom:",
    "네가 있어서 매일이 특별해 :butterfly:",
    "Eres la luz en mis días grises :sunny:",
    "우리 사이엔 시간과 거리가 없어 :crescent_moon:",
    "Tu sonrisa hace que todo valga la pena :blush:",
    "너와 함께하는 모든 순간이 행복해 :hibiscus:",
    "Eres mi hogar, sin importar dónde estés :house:",
    "너는 나의 기쁨이야, 언제나! :rainbow:",
    "Eres el abrazo que mi alma necesita :hugging:",
    "항상 너를 응원하고 있어 :muscle:",
    "Gracias por existir y ser tú :sparkling_heart:",
    "네 존재만으로도 내 삶은 더 아름다워져 :blossom:",
    "Eres magia en forma de persona :sparkles:",
    "너는 내가 가장 아끼는 사람이야 :star2:",
    "Contigo, todo es mejor :dizzy:",
    "내 인생에서 널 만난 건 큰 행운이야 :four_leaf_clover:",
    "Eres paz en medio del caos :dove:",
    "너와 함께라면 어디든 좋아 :rocket:",
    "No sé cómo sería mi vida sin ti, ni quiero imaginarlo :thought_balloon:",
    "너는 내 하루의 햇살이야 :sunny:",
    "Gracias por ser tú, simplemente tú :bouquet:",
    "내 마음의 가장 따뜻한 곳엔 네가 있어 :love_letter:",
    "Eres el motivo por el que sonrío sin razón :blush:",
    "너는 내가 언제나 믿을 수 있는 사람이야 :handshake:",
    "Tu amistad es mi refugio en los días difíciles :shield:",
    "너와 함께하는 이 순간이 영원했으면 해 :hourglass_flowing_sand:",
    "Eres más que especial para mí :rose:",
    "너의 존재만으로도 나에게는 큰 힘이 돼 :revolving_hearts:",

    // :muscle: Apoyo y motivación
    "힘들 때도 네 편이 되어줄게 :handshake:",
    "Tienes más fuerza de la que imaginas :muscle:",
    "Incluso en tus días oscuros, brillas :sparkles:",
    "언제나 너를 믿고 있어 :100:",
    "No importa cuántas veces caigas, aquí estaré :heartbeat:",
    "Tus batallas también son las mías :shield:",

    // :tada: Celebración y orgullo
    "Estoy tan orgulloso(a) de ti, siempre :tada:",
    "네가 한 모든 걸 진심으로 존경해 :clap:",
    "Cada paso tuyo me inspira :woman_walking::sparkles:",
    "Eres prueba viviente de que los sueños se cumplen :rainbow:",

    // :smile: Dulzura y humor
    "Contigo, hasta el lunes tiene sentido :joy:",
    "너는 내 하루의 당충전이야 :lollipop:",
    "Si fueras emoji, serías todos los bonitos :face_holding_back_tears:",
    "네 생각만 해도 입꼬리가 올라가 :grin:",

    // :milky_way: Poético y profundo
    "En tus ojos caben galaxias que no me canso de mirar :sparkles:",
    "너의 말 한마디에 내 세상이 바뀌어 :earth_africa:",
    "Si pudiera elegir otra vida, te buscaría de nuevo :stars:",
    "너와 함께한 모든 계절이 선물 같아 :fallen_leaf::cherry_blossom::sunny::snowflake:",

    // :brain: Autoestima y reconocimiento
    "Eres suficiente, exactamente como eres :sparkling_heart:",
    "너는 있는 그대로 완벽해 :star2:",
    "Tu esencia ilumina todo lo que tocas :sparkles:",
    "내가 본 너의 진심은 누구보다도 아름다워 :dizzy:"
    ];

  // Recomendaciones de K-dramas (conservadas)
  const dramaRecommendations = [
    { title: "Crash Landing on You", reason: "Porque el amor trasciende fronteras 💕" },
    { title: "Goblin (도깨비)", reason: "Para llorar juntas desde la distancia 😭✨" },
    { title: "Hotel del Luna", reason: "Tan mágico como nuestros chats nocturnos 🌙" },
    { title: "Start-Up", reason: "Perseguir sueños es mejor con una amiga 🚀" },
    { title: "It's Okay to Not Be Okay", reason: "Sanar juntas, crecer juntas 🌱" },
    { title: "Reply 1988", reason: "La nostalgia de una amistad pura 📼" },
    { title: "Touch Your Heart", reason: "Ligero y dulce, perfecto para maratón 🍭" },
    { title: "Strong Woman Do Bong Soon", reason: "Porque eres fuerte y adorable a la vez 💪🌸" }
  ];

  // Verificar y enviar mensajes personales automáticamente
  useEffect(() => {
    const checkForPersonalMessage = () => {
      const personalMessage = personalMessagesSystem.sendPersonalMessage(mood, stats);
      
      if (personalMessage) {
        setCurrentMessage(personalMessage.message);
        setMessageType('personal');
        setShowMessage(true);
        setLastPersonalMessageTime(Date.now());
        
        // Duración más larga para mensajes personales
        setTimeout(() => setShowMessage(false), 12000);
        
        console.log('💕 Mensaje personal enviado:', personalMessage);
      }
    };

    // Verificar cada 30 segundos si hay que enviar un mensaje personal
    const interval = setInterval(checkForPersonalMessage, 30000);
    
    // Verificar inmediatamente al cargar
    checkForPersonalMessage();
    
    return () => clearInterval(interval);
  }, [mood, stats]);

  // Función para mostrar recomendación de drama
  const showDramaRecommendation = useCallback(() => {
    const randomDrama = dramaRecommendations[Math.floor(Math.random() * dramaRecommendations.length)];
    setCurrentMessage(`🎬 ${randomDrama.title}\n${randomDrama.reason}`);
    setMessageType('drama');
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 10000);
  }, [dramaRecommendations]);

  // Función para mostrar mensaje personal inmediato
  const showPersonalMessage = useCallback((category = null) => {
    const personalMessage = personalMessagesSystem.sendImmediateMessage(category);
    
    if (personalMessage) {
      setCurrentMessage(personalMessage.message);
      setMessageType('personal');
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 12000);
    }
  }, []);

  // Registrar funciones globalmente para acceso externo
  useEffect(() => {
    window.CatComponentRef = { 
      showDramaRecommendation,
      showPersonalMessage
    };
    return () => {
      window.CatComponentRef = null;
    };
  }, [showDramaRecommendation, showPersonalMessage]);

  // Manejar click en el gato con lógica mejorada
  const handleCatClick = useCallback(() => {
    if (typeof onClick === 'function') {
      onClick();
    }
    
    setClickCount(prev => prev + 1);
    
    // 40% probabilidad de mensaje personal, 60% mensaje de amor original
    const showPersonal = Math.random() < 0.4;
    
    if (showPersonal) {
      // Mensaje personal contextual
      const personalMessage = personalMessagesSystem.sendImmediateMessage();
      if (personalMessage) {
        setCurrentMessage(personalMessage.message);
        setMessageType('personal');
      }
    } else {
      // Mensaje de amor original
      const randomMessage = loveMessages[Math.floor(Math.random() * loveMessages.length)];
      setCurrentMessage(randomMessage);
      setMessageType('love');
    }
    
    setShowMessage(true);
    
    // Efecto visual de click
    if (catRef.current) {
      catRef.current.style.transform = 'scale(0.95)';
      setTimeout(() => {
        if (catRef.current) {
          catRef.current.style.transform = '';
        }
      }, 150);
    }
    
    setTimeout(() => setShowMessage(false), showPersonal ? 12000 : 8000);
  }, [onClick, loveMessages]);

  // Obtener clases CSS basadas en el estado de ánimo
  const getMoodClass = () => {
    switch (mood) {
      case 'superFeliz': return 'super-happy';
      case 'feliz': return 'happy';
      case 'neutro': return 'neutral';
      case 'triste': return 'sad';
      case 'muySad': return 'very-sad';
      default: return 'neutral';
    }
  };

  // Obtener clases CSS basadas en el nivel de energía
  const getEnergyClass = () => {
    if (stats.energia > 80) return 'high-energy';
    if (stats.energia > 50) return 'medium-energy';
    if (stats.energia > 20) return 'low-energy';
    return 'very-low-energy';
  };

  // Determinar si mostrar efectos de sueño
  const showSleepEffects = stats.energia < 20;

  // Manejar carga de imagen
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // Manejar error de carga de imagen
  const handleImageError = useCallback((e) => {
    console.error('Error cargando imagen del gato');
    // SVG de fallback
    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='80' fill='%23ff8c42'/%3E%3Ctext x='100' y='110' text-anchor='middle' font-size='24'%3E🐱%3C/text%3E%3C/svg%3E";
  }, []);

  // Determinar el estilo del globo según el tipo de mensaje
  const getMessageBubbleClass = () => {
    switch (messageType) {
      case 'personal': return 'personal';
      case 'drama': return 'drama';
      case 'love': return 'love';
      default: return 'love';
    }
  };

  return (
    <div className="cat-container">
      {/* Globo de mensaje mejorado */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            className={`speech-bubble ${getMessageBubbleClass()}`}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="speech-content">
              {/* Indicador de tipo de mensaje */}
              {messageType === 'personal' && (
                <div className="message-type-indicator">
                  ✨ Mensaje Especial ✨
                </div>
              )}
              
              {currentMessage.split('\n').map((line, index) => (
                <div key={index} className="message-line">
                  {line}
                </div>
              ))}
              
              {/* Footer del mensaje personal */}
              {messageType === 'personal' && (
                <div className="personal-message-footer">
                  💕 Con amor, tu gatito personal 💕
                </div>
              )}
            </div>
            <div className="speech-tail"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicador de estado de ánimo */}
      <div className={`mood-indicator ${getMoodClass()}`}>
        {mood === 'superFeliz' ? '💕' : 
         mood === 'feliz' ? '😊' : 
         mood === 'neutro' ? '😐' : 
         mood === 'triste' ? '😢' : '😭'}
      </div>

      {/* Contenedor principal del gato */}
      <div 
        ref={catRef}
        className={`cat-wrapper ${getMoodClass()} ${getEnergyClass()}`}
        onClick={handleCatClick}
        style={{
          '--energy-level': `${stats.energia}%`,
          '--happiness-level': `${(stats.carino + stats.diversion) / 2}%`
        }}
      >
        {/* Placeholder de carga */}
        {!imageLoaded && (
          <div className="loading-placeholder">
            <div className="loading-spinner">🐱</div>
            <span>Cargando tu gatito especial...</span>
          </div>
        )}

        {/* Imagen del gato */}
        <img 
          className={`cat-image ${getMoodClass()} ${getEnergyClass()} ${imageLoaded ? 'loaded' : 'loading'}`}
          src={catOrangeImage}
          alt="Tu gato naranja especial"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />

        {/* Efectos de partículas según el estado de ánimo */}
        {mood === 'superFeliz' && (
          <div className="particle-effects hearts">
            <div className="particle heart-1">💕</div>
            <div className="particle heart-2">💖</div>
            <div className="particle heart-3">💝</div>
            <div className="particle heart-4">💗</div>
            <div className="particle heart-5">✨</div>
          </div>
        )}

        {mood === 'feliz' && (
          <div className="particle-effects sparkles">
            <div className="particle sparkle-1">✨</div>
            <div className="particle sparkle-2">⭐</div>
            <div className="particle sparkle-3">💫</div>
            <div className="particle sparkle-4">🌟</div>
          </div>
        )}

        {showSleepEffects && (
          <div className="particle-effects sleep">
            <div className="particle sleep-1">💤</div>
            <div className="particle sleep-2">Z</div>
            <div className="particle sleep-3">z</div>
          </div>
        )}

        {/* Efecto especial para mensajes personales */}
        {messageType === 'personal' && showMessage && (
          <div className="particle-effects personal-message-effect">
            <div className="particle personal-1">💕</div>
            <div className="particle personal-2">🌸</div>
            <div className="particle personal-3">✨</div>
            <div className="particle personal-4">💖</div>
            <div className="particle personal-5">🌟</div>
            <div className="particle personal-6">💫</div>
          </div>
        )}
      </div>

      {/* Contador de interacciones con información adicional */}
      <div className="interaction-counter">
        <span>상호작용: {clickCount}</span>
        {lastPersonalMessageTime > 0 && (
          <span className="last-message-time">
            💕 Último mensaje especial: {new Date(lastPersonalMessageTime).toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Botones de acción rápida para mensajes personales */}
      <div className="personal-message-controls">
        <button 
          className="message-control-btn motivation"
          onClick={() => showPersonalMessage('motivation')}
          title="Mensaje motivacional"
        >
          💪 Ánimo
        </button>
        <button 
          className="message-control-btn comfort"
          onClick={() => showPersonalMessage('comfort')}
          title="Mensaje de consuelo"
        >
          🫂 Abrazo
        </button>
        <button 
          className="message-control-btn celebration"
          onClick={() => showPersonalMessage('celebration')}
          title="Mensaje de celebración"
        >
          🎉 Celebrar
        </button>
        <button 
          className="message-control-btn friendship"
          onClick={() => showPersonalMessage('friendship')}
          title="Mensaje de amistad"
        >
          👭 Amistad
        </button>
      </div>
    </div>
  );
};

export default CatComponent;