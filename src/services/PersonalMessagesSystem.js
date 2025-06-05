// ============================================
// SISTEMA DE MENSAJES PERSONALES
// ============================================

class PersonalMessagesSystem {
  constructor() {
    // ⚠️ PERSONALIZA ESTA INFORMACIÓN PARA TU AMIGA
    this.personalInfo = {
      friendName: 'Mikasa', // ← CAMBIA ESTO por su nombre
      yourName: 'Kiri', // ← CAMBIA ESTO por tu nombre
      nickname: 'MiMikasita', // ← CAMBIA ESTO por su apodo cariñoso
      favoriteEmoji: '🌸', // ← Su emoji favorito
      specialWords: ['hermosa', 'increíble', 'especial', 'única'] // ← Palabras que la describen
    };

    this.messageCategories = {
      morning: 'morning',
      afternoon: 'afternoon',
      evening: 'evening',
      motivation: 'motivation',
      comfort: 'comfort',
      celebration: 'celebration',
      random: 'random',
      friendship: 'friendship',
      selfcare: 'selfcare',
      kpop: 'kpop'
    };

    this.lastMessageTime = 0;
    this.messageHistory = this.loadMessageHistory();
  }

  // ============================================
  // BIBLIOTECA DE MENSAJES PERSONALES
  // ============================================

  getPersonalMessages() {
    const { friendName, yourName, nickname, favoriteEmoji, specialWords } = this.personalInfo;
    
    return {
      morning: [
        `¡Buenos días, ${friendName}! ☀️ Tu gatito ya desayunó kimchi, ¿y tú qué vas a desayunar?`,
        `안녕하세요, ${nickname}! 🌅 Espero que tengas un día tan radiante como tu sonrisa`,
        `¡Annyeong! ${favoriteEmoji} El sol salió hoy solo para verte brillar, ${friendName}`,
        `Buenos días, mi humana favorita 🥰 ${yourName} me dijo que eres la más ${specialWords[0]} del mundo`,
        `¡Ohayo gozaimasu! 🌸 (Oops, eso es japonés) 안녕, ${nickname}! ¡Que tengas un día lleno de amor!`,
        `Gatito reportándose: ✨ ${friendName} sigue siendo perfecta hoy también`,
        `🌅 Nueva misión desbloqueada: Hacer sonreír a ${nickname} al menos 47 veces hoy`
      ],

      afternoon: [
        `¡Hora del almuerzo, ${friendName}! 🍜 ¿Ya comiste algo delicioso?`,
        `Rapporten del medio día: ${nickname} sigue siendo adorable 💕`,
        `¿Sabías que cada vez que sonríes, ${friendName}, mi barra de felicidad sube al 1000%? 📊✨`,
        `${yourName} me dijo que te recordara: ¡Eres increíble! 🌟 Yo agregué: ¡Y hermosa también!`,
        `Hora de la siesta virtual conmigo, ${nickname} 😴 Prometaré soñar cosas bonitas sobre ti`,
        `Notificación importante: ${friendName} necesita un abrazo virtual 🤗 *envía 1000 abrazos*`,
        `¿Ya tomaste agua hoy, ${nickname}? 💧 Tu gatito se preocupa por tu hidratación`
      ],

      evening: [
        `Buenas noches, ${friendName} 🌙 Que sueñes con campos de flores de cerezo`,
        `Es hora de descansar, ${nickname} ✨ Mañana será otro día maravilloso contigo`,
        `🌟 El gatito te manda estrellitas para que tengas los sueños más bonitos`,
        `Antes de dormir, recuerda: ${yourName} piensa que eres lo más ${specialWords[2]} del universo`,
        `좋은 꿈 꿔 (que tengas dulces sueños), mi ${nickname} favorita 💤`,
        `Modo nocturno activado 🌛 Preparando sueños especiales para ${friendName}`,
        `Última actividad del día: Enviar todo mi amor a ${nickname} ${favoriteEmoji}`
      ],

      motivation: [
        `¡Oye ${friendName}! 💪 Eres más fuerte de lo que crees y más valiente de lo que imaginas`,
        `Recordatorio diario: ${nickname} puede con todo lo que se proponga ✨`,
        `${yourName} cree en ti, yo creo en ti, ¡ahora tú también cree en ti! 🌟`,
        `Dato curioso: Ser ${specialWords[0]} como ${friendName} es un superpoder único 💫`,
        `¡Ánimo, ${nickname}! Cada paso que das ilumina el mundo un poquito más ☀️`,
        `Tu gatito dice: "¡${friendName} es la definición de ${specialWords[1]}!" 🎯`,
        `Mensaje motivacional: Eres exactamente quien necesitas ser, ${nickname} 💕`
      ],

      comfort: [
        `Hey ${friendName}, está bien no estar bien a veces 🫂 Tu gatito está aquí para acompañarte`,
        `*abrazo virtual extra fuerte para ${nickname}* 💗 Esto también pasará, eres resiliente`,
        `${yourName} me dijo que te diga: "Eres amada exactamente como eres" 🌸`,
        `Recordatorio suave: Incluso en días grises, ${friendName} sigue siendo un rayo de sol ☀️`,
        `Para mi ${nickname}: Las tormentas pasan, pero tu luz interior es eterna ✨`,
        `Momento de autocuidado obligatorio para ${friendName} 🛁 ¡Consiéntete como mereces!`,
        `Tu gatito prescribe: Una taza de té, tu canción favorita y recordar que eres ${specialWords[3]} 🍵`
      ],

      celebration: [
        `¡CELEBRACIÓN! 🎉 ${friendName} acaba de hacer algo increíble (como siempre)`,
        `¡Confetti virtual para ${nickname}! ✨🎊 Te lo mereces todo y más`,
        `${yourName} está súper orgulloso de ti, ${friendName} 🏆 ¡Y yo también!`,
        `¡Baile de la felicidad activado! 💃 ${nickname} bringing the energy como siempre`,
        `Noticia de última hora: ${friendName} sigue siendo la mejor persona del mundo 📰✨`,
        `¡Achievement unlocked! 🏅 Ser absolutamente ${specialWords[0]} - Completado por ${nickname}`,
        `¡Hora de celebrar con aegyo! 🥳 Saranghae, ${friendName}! 💕`
      ],

      friendship: [
        `${yourName} tiene mucha suerte de tener una amiga como ${friendName} 💫`,
        `Fact check: ${nickname} es oficialmente la mejor amiga del universo ✅`,
        `Cada día ${yourName} agradece tener a alguien tan ${specialWords[2]} como tú en su vida`,
        `La amistad entre ${yourName} y ${friendName} es más hermosa que cualquier K-drama 📺💕`,
        `Recordatorio: ${nickname}, tu amistad es uno de los tesoros más preciados de ${yourName}`,
        `Plot twist: Conocer a ${friendName} fue la mejor cosa que le pasó a ${yourName} 🌟`,
        `Certificado oficial: ${nickname} es una amiga ${specialWords[1]} - Firmado por tu gatito 📜`
      ],

      selfcare: [
        `Pregunta importante: ¿${friendName} ya se cuidó hoy como la ${specialWords[0]} que es? 🌸`,
        `Recordatorio de autocuidado para ${nickname}: Mereces amor, empezando por el tuyo propio 💝`,
        `Tu gatito prescribe: 10 minutos de algo que te haga feliz, ${friendName} ⏰✨`,
        `¿Ya bebiste agua, ${nickname}? 💧 Tu bienestar es prioridad número uno`,
        `Momento de gratitud: ${friendName}, ¿qué te hizo sonreír hoy? 😊`,
        `Check-in emocional: ¿Cómo está el corazón de ${nickname} hoy? 💗`,
        `Nota para ${friendName}: Está bien tomarte un descanso cuando lo necesites 🛋️`
      ],

      kpop: [
        `¿Ya escuchaste tu canción coreana favorita hoy, ${friendName}? 🎵 Es medicina para el alma`,
        `${nickname} + K-pop = Combinación perfecta ✨ ¿Cuál es tu mood musical hoy?`,
        `Tu gatito recomienda: Un break de baile a lo BTS para ${friendName} 💃🕺`,
        `Pregunta random: Si fueras idol, ¿cuál sería tu concept, ${nickname}? 🌟`,
        `${yourName} dice que tus reactions a K-pop son las más divertidas, ${friendName} 😂`,
        `Teoría: Los idols escriben canciones pensando en fans como ${nickname} 🎤💕`,
        `¿Maratón de K-dramas tonight, ${friendName}? Tu gatito trae los snacks virtuales 🍿`
      ],

      random: [
        `Pensamiento random: ${friendName} haría que hasta los días lluviosos sean soleados ☔➡️☀️`,
        `¿Sabías que ${nickname} tiene la risa más contagiosa del mundo? Dato científico 📊😊`,
        `If ${friendName} was a flower, serías toda la primavera junta 🌸🌺🌻`,
        `Random fact: Pensar en ${nickname} es el cheat code para la felicidad de ${yourName} 🎮✨`,
        `Declaración oficial: ${friendName} es la definición humana de ${favoriteEmoji}`,
        `Teoría conspirativa: ${nickname} en realidad es un ángel disfrazado de humana 👼`,
        `Breaking news: ${friendName} sigue siendo perfecta. More details at 11 📺💕`
      ]
    };
  }

  // ============================================
  // SISTEMA DE ENVÍO INTELIGENTE
  // ============================================

  shouldSendMessage() {
    const now = Date.now();
    const timeSinceLastMessage = now - this.lastMessageTime;
    const minimumInterval = 2 * 60 * 60 * 1000; // 2 horas mínimo
    
    return timeSinceLastMessage >= minimumInterval;
  }

  getTimeBasedCategory() {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) return this.messageCategories.morning;
    if (hour >= 12 && hour < 18) return this.messageCategories.afternoon;
    if (hour >= 18 || hour < 6) return this.messageCategories.evening;
    
    return this.messageCategories.random;
  }

  getContextualMessage(mood = null, stats = null) {
    const messages = this.getPersonalMessages();
    let category;

    // Determinar categoría basada en contexto
    if (mood === 'muySad' || mood === 'triste') {
      category = this.messageCategories.comfort;
    } else if (mood === 'superFeliz') {
      category = this.messageCategories.celebration;
    } else if (stats && this.needsMotivation(stats)) {
      category = this.messageCategories.motivation;
    } else {
      // Usar categoría basada en tiempo o aleatoria
      const timeCategory = this.getTimeBasedCategory();
      const randomCategories = [
        timeCategory,
        this.messageCategories.friendship,
        this.messageCategories.selfcare,
        this.messageCategories.kpop,
        this.messageCategories.random
      ];
      
      category = randomCategories[Math.floor(Math.random() * randomCategories.length)];
    }

    const categoryMessages = messages[category];
    const availableMessages = this.filterUnusedMessages(categoryMessages, category);
    
    if (availableMessages.length === 0) {
      // Si no hay mensajes sin usar, resetear el historial para esa categoría
      this.resetCategoryHistory(category);
      return categoryMessages[Math.floor(Math.random() * categoryMessages.length)];
    }

    const selectedMessage = availableMessages[Math.floor(Math.random() * availableMessages.length)];
    this.markMessageAsUsed(selectedMessage, category);
    
    return selectedMessage;
  }

  needsMotivation(stats) {
    const average = (stats.energia + stats.entretenimiento + stats.carino + stats.diversion) / 4;
    return average < 40;
  }

  // ============================================
  // GESTIÓN DE HISTORIAL DE MENSAJES
  // ============================================

  filterUnusedMessages(messages, category) {
    const usedMessages = this.messageHistory[category] || [];
    return messages.filter(message => !usedMessages.includes(message));
  }

  markMessageAsUsed(message, category) {
    if (!this.messageHistory[category]) {
      this.messageHistory[category] = [];
    }
    
    this.messageHistory[category].push(message);
    this.lastMessageTime = Date.now();
    this.saveMessageHistory();
  }

  resetCategoryHistory(category) {
    this.messageHistory[category] = [];
    this.saveMessageHistory();
  }

  loadMessageHistory() {
    try {
      const saved = localStorage.getItem('catTamagotchi_messageHistory');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Error loading message history:', error);
      return {};
    }
  }

  saveMessageHistory() {
    try {
      localStorage.setItem('catTamagotchi_messageHistory', JSON.stringify(this.messageHistory));
      localStorage.setItem('catTamagotchi_lastMessageTime', this.lastMessageTime.toString());
    } catch (error) {
      console.error('Error saving message history:', error);
    }
  }

  // ============================================
  // API PÚBLICA
  // ============================================

  sendPersonalMessage(mood = null, stats = null, forceCategory = null) {
    if (!this.shouldSendMessage() && !forceCategory) {
      return null;
    }

    const messages = this.getPersonalMessages();
    let message;

    if (forceCategory && messages[forceCategory]) {
      const categoryMessages = messages[forceCategory];
      message = categoryMessages[Math.floor(Math.random() * categoryMessages.length)];
    } else {
      message = this.getContextualMessage(mood, stats);
    }

    return {
      message,
      timestamp: Date.now(),
      category: this.getCurrentCategory(message),
      isPersonal: true
    };
  }

  getCurrentCategory(message) {
    const messages = this.getPersonalMessages();
    for (const [category, categoryMessages] of Object.entries(messages)) {
      if (categoryMessages.includes(message)) {
        return category;
      }
    }
    return 'unknown';
  }

  // Método para forzar mensajes inmediatos (para testing)
  sendImmediateMessage(category = null) {
    return this.sendPersonalMessage(null, null, category);
  }

  // Método para actualizar información personal
  updatePersonalInfo(newInfo) {
    this.personalInfo = { ...this.personalInfo, ...newInfo };
  }

  // Método para obtener estadísticas de mensajes
  getMessageStats() {
    const totalSent = Object.values(this.messageHistory).reduce((acc, category) => acc + category.length, 0);
    return {
      totalMessagesSent: totalSent,
      categoriesUsed: Object.keys(this.messageHistory).length,
      lastMessageTime: this.lastMessageTime,
      messageHistory: this.messageHistory
    };
  }
}

// ============================================
// INSTANCIA SINGLETON
// ============================================

const personalMessagesSystem = new PersonalMessagesSystem();

export default personalMessagesSystem;