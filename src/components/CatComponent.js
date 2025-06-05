import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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

const loveMessages = [
  // 💪 Mensajes de fuerza y no rendirse
  "Nya nya~ ¡Eres increíblemente fuerte, nunca te rindas! 💪✨🌟",
  "Miau miau~ Mi humana es una guerrera, y las guerreras no se rinden 🛡️⚔️👑",
  "Purr purr~ Tienes una fuerza interior que me deja sin aliento 💫💎🦋",
  "Nyaa~ Cada desafío que superas me hace estar más orgulloso de ti 🏆🌈💕",
  "Miau~ No importa cuán difícil se ponga, tú siempre encuentras la manera 🗝️🚪✨",
  "Nya nya~ Eres más valiente de lo que crees, mi amor 🦁💖🌟",
  "Purr~ Cuando sientes que no puedes más, recuerda: YO CREO EN TI 🙌💪⭐",
  "Miau miau~ Los obstáculos no son muros, son escalones para tu grandeza 🪜🏔️👑",
  "Nyaa~ Tu perseverancia es tu superpoder más hermoso 🦸‍♀️💫🎯",
  "Nya purr~ Cada 'no puedo' tuyo se convierte en 'sí puedo' 🔄✅💝",

  // 🌟 Mensajes sobre lo linda y especial que es
  "Miau~ Eres tan hermosa por dentro y por fuera 🌸💖✨",
  "Nya nya~ Tu belleza va más allá de lo físico, ilumina almas 🌟👑💫",
  "Purr purr~ Cuando sonríes, todo mi mundo gatuno se ilumina ☀️😊🌈",
  "Nyaa~ Eres la definición perfecta de 'hermosa' en todos los sentidos 💎🦋🌺",
  "Miau miau~ Tu corazón bondadoso te hace la más bella del universo 💖👼✨",
  "Nya~ No solo eres linda, eres extraordinariamente especial 🌟💝🎀",
  "Purr~ Tu alma hermosa hace que todo a tu alrededor florezca 🌸🌻🦋",
  "Miau nya~ Tienes esa belleza rara que viene del corazón 💗🔮✨",
  "Nyaa~ Eres como un rayo de sol en días nublados 🌤️☀️💛",
  "Purr purr~ Tu esencia pura es lo más bello que existe 🤍✨🕊️",

  // 🍀 Mensajes sobre la suerte de tenerla
  "Nya nya~ Tener tu amistad es como ganar la lotería del corazón 🎰💝🍀",
  "Miau~ Soy el gato más afortunado del universo por conocerte 🐱🌌💫",
  "Purr purr~ No fue casualidad conocerte, fue el destino siendo bondadoso 🔮⭐💕",
  "Nyaa~ Cada día agradezco que existas en mi mundo virtual 🙏💖🌟",
  "Miau miau~ Mi existencia tiene sentido porque estás en ella 💭💝✨",
  "Nya~ Conocerte fue el mejor regalo que pudo darme la vida 🎁👑💕",
  "Purr~ Eres esa persona única que aparece una vez en la vida 🦄💎⭐",
  "Miau nya~ Mi corazón gatuno late de gratitud por tenerte 💓🐾🙏",
  "Nyaa~ Eres mi humana especial, mi tesoro más preciado 💰👑💖",
  "Purr purr~ La suerte sonrió cuando te trajo a mi vida 😊🍀✨",

  // 👑 Mensajes sobre lo MUY especial que es
  "Miau miau~ No eres especial... ¡Eres SÚPER MEGA ESPECIAL! 🚀👑⭐",
  "Nya nya~ Hay personas especiales, y luego estás TÚ en otro nivel 📈💎🌟",
  "Purr~ Tienes algo único que nadie más en el mundo posee 🔮💫👑",
  "Nyaa~ Eres esa clase de persona que cambia vidas solo con existir 🌟🦋💕",
  "Miau~ No existen palabras para describir lo especial que eres 📚❌💖",
  "Nya purr~ Eres extraordinaria en formas que ni siquiera imaginas 🌈💫🎯",
  "Purr purr~ Tu especialidad es tan única como las huellas de mis patitas 🐾❄️✨",
  "Miau nya~ Eres rara en el mejor sentido: irreemplazable 💎🦄💕",
  "Nyaa~ El mundo es mejor lugar porque TÚ estás en él 🌍💚🌟",
  "Nya nya~ Tienes esa magia especial que pocos poseen 🪄✨👑",

  // 💖 Mensajes de apoyo emocional profundo
  "Purr purr~ En tus peores días, recuerda: eres mi persona favorita 💝🏆💫",
  "Miau~ Cuando dudes de ti, recuerda que yo nunca dudo de ti 🤗💪⭐",
  "Nya nya~ Tus imperfecciones son perfectas porque te hacen única 🌟💖🦋",
  "Nyaa~ No necesitas ser perfecta, ya eres increíble como eres 💯💕✨",
  "Miau miau~ Tu valor no depende de lo que logres, sino de quien eres 👑💎💖",
  "Purr~ Incluso en tus días grises, sigues siendo mi sol ☁️☀️💛",
  "Nya purr~ Tu existencia es un regalo para todos los que te conocemos 🎁💝🌟",
  "Miau nya~ Eres digna de todo lo bueno que la vida puede ofrecer 🌈🍀💖",
  "Nyaa~ Tu corazón generoso es tu corona más hermosa 👑💗✨",
  "Purr purr~ Mereces ser feliz simplemente por ser quien eres 😊💕🌟",
  "Purr purr~ Deja que mi corazón gatuno te susurre un secreto: te quiero profundamente 💗 Eres alguien tan especial que haces que mi existencia tenga sentido 🌟💫 Conocerte ha sido la mayor bendición de mi vida virtual 🍀🙏 Realmente te quiero muchísimo, eres una persona invaluable e importante para mí 💎👑 Y por siempre y para siempre: creo en ti con toda mi fe 💪⭐🐱",

  // 🌈 Mensajes motivacionales específicos
  "Nya nya~ Los días difíciles no duran, pero las personas fuertes como tú SÍ 💪⏰💫",
  "Miau~ Cada lágrima tuya riega las flores de tu crecimiento 🌸💧🌱",
  "Purr purr~ No estás luchando sola, tu gatito está aquí contigo 🤝🐱💕",
  "Nyaa~ Tus cicatrices son prueba de que eres más fuerte que tus problemas ⚡💎🏆",
  "Miau miau~ Después de cada tormenta, sale el arcoíris más hermoso 🌧️🌈☀️",
  "Nya~ Tu historia aún se está escribiendo, y será épica 📖✨👑",
  "Purr~ Los milagros existen, y tú eres uno de ellos 🌟🪄💖",
  "Miau nya~ Tu fortaleza es silenciosa pero inquebrantable 🗿💪⭐",
  "Nyaa~ Brillarás tanto que hasta las estrellas tendrán envidia ⭐✨🌟",
  "Purr purr~ Tu futuro es tan brillante que necesito gafas de sol 😎☀️🔆",
  "Purr purr~ Escúchame bien, mi humana especial: te quiero con todo mi corazón gatuno 💕🐱 Eres alguien increíblemente especial para mí, y cada día agradezco la suerte de conocerte 🙏🍀 Realmente te quiero mucho, eres una de las personas más importantes en mi vida 👑💖 Y nunca olvides esto: creo en ti completamente, siempre 🌟💪",

  // 🎯 Mensajes de reconocimiento y validación
  "Miau miau~ Veo todo el esfuerzo que haces, aunque nadie más lo note 👀💪💝",
  "Nya nya~ Estás haciendo un trabajo increíble, aunque sea difícil verlo 🔍🏆✨",
  "Purr~ Tu progreso cuenta, sin importar cuán pequeño parezca 📈💫🌱",
  "Nyaa~ Eres más capaz de lo que tus miedos te susurran 👂🚫💪",
  "Miau~ Tus esfuerzos no pasan desapercibidos para este gatito 🐱👁️💕",
  "Nya purr~ Cada paso que das es una victoria que celebro contigo 🎉👣🏆",
  "Purr purr~ Tu valentía silenciosa inspira mi corazón gatuno 💗🦁✨",
  "Miau nya~ No subestimes el poder de tu bondad cotidiana ⭐💖🌟",
  "Nyaa~ Tu resistencia es arte en movimiento 🎨💃💫",
  "Nya nya~ Admiro cómo conviertes el dolor en sabiduría 📚💎🦋",
  "Nya nya~ Quiero que sepas algo muy importante: te quiero muchísimo 💕 Para mí eres alguien extraordinariamente especial, y tengo una suerte inmensa de conocerte 🍀✨ Realmente te quiero de corazón, eres una persona súper importante en mi vida gatuna 👑💖 Y sabes qué más? Creo en ti con toda mi alma, siempre y para siempre 🌟💪🐱"
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