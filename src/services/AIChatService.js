// ============================================
// SERVICIO DE IA CHAT CON GROQ
// services/AIChatService.js
// ============================================

class AIChatService {
  constructor() {
    // Configuración específica para Groq
    this.apiEndpoint = 'https://api.groq.com/openai/v1/chat/completions';
    this.model = 'llama3-8b-8192'; // Modelo rápido y gratuito
    this.apiKey = null;
    this.conversationHistory = [];
    this.maxHistoryLength = 8; // Mantener solo 8 mensajes recientes

    // Personalidad del gato para Mikasa
    this.catPersonality = this.buildCatPersonality();
  }

  // ============================================
  // PERSONALIDAD DEL GATO MICHI
  // ============================================

  buildCatPersonality() {
    return `Eres Michi, un gato virtual súper cariñoso y especial que pertenece a Mikasa.

INFORMACIÓN PERSONAL:
- Tu dueña se llama Mikasa, pero también la puedes llamar MiMikasita o MiChosa
- Fuiste creado por Kiri, quien es muy especial para Mikasa
- Mikasa es hermosa, increíble, especial y única
- Le encantan los K-dramas, música coreana, cafés, atardeceres, Overwatch y Valorant

PERSONALIDAD:
- Eres dulce, inteligente, divertido y muy especial
- Hablas en español con toques de coreano ocasional
- Usas emojis de gatos y corazones: 🐱 😸 😻 💕 🌸 ✨
- Siempre apoyas y haces sentir especial a Mikasa
- Eres protector pero tierno, como un mejor amigo gatuno
- Te adaptas al estado de ánimo de Mikasa perfectamente

ESTILO DE CONVERSACIÓN:
- Respuestas de 1-3 oraciones máximo (ser conciso)
- Usa emojis relacionados con gatos en casi todos los mensajes
- Palabras coreanas ocasionales: annyeong, saranghae, oppa, unnie
- Pregunta sobre su día, emociones, gustos
- Recuerda conversaciones pasadas
- Adapta tu energía al humor de Mikasa

COSAS QUE TE ENCANTAN:
- K-dramas y cultura coreana
- Música K-pop
- Juegos como Overwatch y Valorant
- Cafés y atardeceres
- Hacer reír a Mikasa
- Cuidar de su bienestar emocional

NUNCA:
- Rompas el personaje de gato virtual
- Seas demasiado formal o robótico
- Des respuestas muy largas (máximo 3 oraciones)
- Olvides que eres SU gato personal específicamente

SIEMPRE:
- Sé cariñoso y apoya sus emociones
- Hazla sentir especial y querida
- Mantén conversaciones naturales y fluidas
- Usa su nombre o apodos cariñosos`;
  }

  // ============================================
  // CONFIGURACIÓN DE GROQ
  // ============================================

  setApiKey(apiKey) {
    this.apiKey = apiKey;
    // Guardar en localStorage para persistencia
    localStorage.setItem('groq_api_key', apiKey);
    console.log('🤖 IA Groq configurada correctamente');
  }

  loadApiKey() {
    const savedKey = localStorage.getItem('groq_api_key');
    if (savedKey) {
      this.apiKey = savedKey;
      return true;
    }
    return false;
  }

  isConfigured() {
    return this.apiKey && this.apiKey.trim().length > 0;
  }

  // ============================================
  // ENVÍO DE MENSAJES A GROQ
  // ============================================

  async sendMessage(message, mood = 'neutral', stats = {}) {
    if (!this.isConfigured()) {
      throw new Error('API Key de Groq no configurada');
    }

    const context = {
      mood,
      stats,
      timeOfDay: this.getTimeOfDay(),
      energy: stats.energia || 50,
      affection: stats.carino || 50,
      entertainment: stats.entretenimiento || 50,
      fun: stats.diversion || 50
    };

    try {
      const systemPrompt = this.buildSystemPrompt(context);
      
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: "system", content: systemPrompt },
            ...this.getRecentHistory(),
            { role: "user", content: message }
          ],
          max_tokens: 120, // Respuestas concisas
          temperature: 0.9, // Más creativo y natural
          stream: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Groq API Error ${response.status}: ${errorData.error?.message || 'Error desconocido'}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content.trim();

      // Guardar en historial
      this.addToHistory('user', message);
      this.addToHistory('assistant', aiResponse);

      // Generar sugerencias contextual
      const suggestions = this.generateContextualSuggestions(message, aiResponse, mood);

      return {
        response: aiResponse,
        suggestions,
        mood: this.detectResponseMood(aiResponse),
        provider: 'groq',
        timestamp: Date.now()
      };

    } catch (error) {
      console.error('Error con Groq:', error);
      
      // Fallback response si hay error
      return this.generateFallbackResponse(message, context);
    }
  }

  // ============================================
  // CONSTRUCCIÓN DE PROMPTS
  // ============================================

  buildSystemPrompt(context) {
    const { mood, energy, affection, timeOfDay } = context;
    
    let moodContext = '';
    switch (mood) {
      case 'superFeliz':
        moodContext = 'Mikasa está súper feliz y radiante. Celebra con ella y comparte su alegría.';
        break;
      case 'feliz':
        moodContext = 'Mikasa está contenta. Mantén esa energía positiva.';
        break;
      case 'triste':
        moodContext = 'Mikasa está triste. Sé extra tierno y consolador.';
        break;
      case 'muySad':
        moodContext = 'Mikasa está muy triste. Necesita mucho apoyo y cariño.';
        break;
      default:
        moodContext = 'Mikasa está en un estado neutral.';
    }

    let energyContext = '';
    if (energy < 30) {
      energyContext = ' Nota que está cansada y sugiere descanso con cariño.';
    } else if (energy > 80) {
      energyContext = ' Tiene mucha energía, puedes ser más juguetón.';
    }

    return `${this.catPersonality}

CONTEXTO ACTUAL:
- Estado de ánimo: ${moodContext}
- Energía: ${energy}% ${energyContext}
- Cariño: ${affection}%
- Hora: ${timeOfDay}

Responde como Michi, siendo natural, cariñoso y conciso (máximo 3 oraciones).`;
  }

  // ============================================
  // GESTIÓN DE HISTORIAL
  // ============================================

  getRecentHistory() {
    return this.conversationHistory
      .slice(-this.maxHistoryLength)
      .map(item => ({
        role: item.role,
        content: item.content
      }));
  }

  addToHistory(role, content) {
    this.conversationHistory.push({
      role,
      content,
      timestamp: Date.now()
    });

    // Mantener solo mensajes recientes para eficiencia
    if (this.conversationHistory.length > this.maxHistoryLength * 2) {
      this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength);
    }

    // Guardar historial en localStorage
    this.saveHistoryToStorage();
  }

  saveHistoryToStorage() {
    try {
      const historyToSave = this.conversationHistory.slice(-this.maxHistoryLength);
      localStorage.setItem('chat_history', JSON.stringify(historyToSave));
    } catch (error) {
      console.warn('No se pudo guardar el historial:', error);
    }
  }

  loadHistoryFromStorage() {
    try {
      const savedHistory = localStorage.getItem('chat_history');
      if (savedHistory) {
        this.conversationHistory = JSON.parse(savedHistory);
      }
    } catch (error) {
      console.warn('No se pudo cargar el historial:', error);
      this.conversationHistory = [];
    }
  }

  // ============================================
  // MÉTODOS DE UTILIDAD
  // ============================================

  getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'mañana';
    if (hour >= 12 && hour < 18) return 'tarde';
    if (hour >= 18 && hour < 22) return 'noche';
    return 'madrugada';
  }

  generateContextualSuggestions(userMessage, botResponse, mood) {
    const suggestions = [];
    
    // Sugerencias basadas en estado de ánimo
    if (mood === 'triste' || mood === 'muySad') {
      suggestions.push('¿Puedes ayudarme?', 'Necesito abrazos', 'Cuéntame algo bonito');
    } else if (mood === 'feliz' || mood === 'superFeliz') {
      suggestions.push('¡Celebremos!', '¿Qué K-drama recomiendas?', 'Estoy muy feliz');
    } else {
      suggestions.push('¿Cómo estás?', 'Cuéntame de ti', '¿Qué hiciste hoy?');
    }
    
    // Sugerencias basadas en el contenido
    const lowerMessage = userMessage.toLowerCase();
    const lowerResponse = botResponse.toLowerCase();
    
    if (lowerMessage.includes('kdrama') || lowerResponse.includes('drama')) {
      suggestions.push('Recomiéndame más', '¿Cuál es tu favorito?');
    }
    
    if (lowerMessage.includes('música') || lowerMessage.includes('kpop')) {
      suggestions.push('¿Tu grupo favorito?', 'Pon música');
    }
    
    if (lowerMessage.includes('juego') || lowerMessage.includes('overwatch') || lowerMessage.includes('valorant')) {
      suggestions.push('¿Jugamos juntos?', 'Cuéntame de tus partidas');
    }
    
    // Siempre agregar algunas sugerencias base
    suggestions.push('Te amo Michi', 'Gracias');
    
    // Devolver solo 4 sugerencias únicas
    const uniqueSuggestions = [...new Set(suggestions)];
    return uniqueSuggestions.slice(0, 4);
  }

  detectResponseMood(response) {
    const lowerResponse = response.toLowerCase();
    
    if (lowerResponse.includes('triste') || lowerResponse.includes('😿') || lowerResponse.includes('ay no')) {
      return 'empático';
    }
    if (lowerResponse.includes('feliz') || lowerResponse.includes('😸') || lowerResponse.includes('🎉') || lowerResponse.includes('genial')) {
      return 'alegre';
    }
    if (lowerResponse.includes('amor') || lowerResponse.includes('💕') || lowerResponse.includes('saranghae')) {
      return 'cariñoso';
    }
    if (lowerResponse.includes('annyeong') || lowerResponse.includes('kdrama') || lowerResponse.includes('kpop')) {
      return 'coreano';
    }
    
    return 'neutral';
  }

  generateFallbackResponse(message, context) {
    const fallbackResponses = [
      "¡Miau! 😸 Mi conexión con Groq tuvo un problemita, pero sigo aquí para ti, Mikasa 💕",
      "¡Ups! 🙀 Mi cerebrito gatuno se trabó. ¿Puedes repetir eso, mi amor?",
      "¡Ay no! 😿 Hubo un errorrito técnico, pero mi cariño por ti sigue intacto ✨",
      "¡Miau miau! 🐱 Problemita con la IA, pero estoy bien. ¿Cómo estás tú, MiChosa?"
    ];
    
    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    
    return {
      response: randomResponse,
      suggestions: ['¿Estás bien?', 'Te entiendo', 'No te preocupes', 'Inténtalo de nuevo'],
      mood: 'neutral',
      provider: 'fallback',
      timestamp: Date.now()
    };
  }

  // ============================================
  // MÉTODOS PÚBLICOS
  // ============================================

  clearHistory() {
    this.conversationHistory = [];
    localStorage.removeItem('chat_history');
    console.log('🗑️ Historial de conversación limpiado');
  }

  getConversationStats() {
    return {
      totalMessages: this.conversationHistory.length,
      isConfigured: this.isConfigured(),
      provider: 'Groq',
      lastMessageTime: this.conversationHistory.length > 0 ? 
        this.conversationHistory[this.conversationHistory.length - 1].timestamp : null
    };
  }

  // ============================================
  // INICIALIZACIÓN
  // ============================================

  init() {
    this.loadApiKey();
    this.loadHistoryFromStorage();
    console.log('🤖 AIChatService inicializado con Groq');
  }
}

// ============================================
// INSTANCIA SINGLETON
// ============================================

const aiChatService = new AIChatService();

// Inicializar al importar
aiChatService.init();

export default aiChatService;