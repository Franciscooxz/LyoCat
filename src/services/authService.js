// ============================================
// SERVICIO DE AUTENTICACIÓN Y PERSISTENCIA
// ============================================

class AuthService {
  constructor() {
    this.storageKeys = {
      isLoggedIn: 'catTamagotchi_isLoggedIn',
      username: 'catTamagotchi_username',
      loginTime: 'catTamagotchi_loginTime',
      gameData: 'catTamagotchi_gameData',
      theme: 'catTamagotchi_theme'
    };
  }

  // ============================================
  // MÉTODOS DE AUTENTICACIÓN
  // ============================================

  /**
   * Verificar si el usuario está logueado
   */
  isAuthenticated() {
    const isLoggedIn = localStorage.getItem(this.storageKeys.isLoggedIn);
    const loginTime = localStorage.getItem(this.storageKeys.loginTime);
    
    if (!isLoggedIn || !loginTime) {
      return false;
    }

    // Verificar si la sesión no ha expirado (opcional: 7 días)
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    const isSessionValid = (Date.now() - parseInt(loginTime)) < sevenDaysInMs;
    
    if (!isSessionValid) {
      this.logout();
      return false;
    }

    return true;
  }

  /**
   * Obtener el usuario actual
   */
  getCurrentUser() {
    if (!this.isAuthenticated()) {
      return null;
    }
    
    return {
      username: localStorage.getItem(this.storageKeys.username),
      loginTime: parseInt(localStorage.getItem(this.storageKeys.loginTime))
    };
  }

  /**
   * Cerrar sesión
   */
  logout() {
    // Mantener solo los datos del juego y tema
    const gameData = localStorage.getItem(this.storageKeys.gameData);
    const theme = localStorage.getItem(this.storageKeys.theme);
    
    // Limpiar datos de sesión
    localStorage.removeItem(this.storageKeys.isLoggedIn);
    localStorage.removeItem(this.storageKeys.username);
    localStorage.removeItem(this.storageKeys.loginTime);
    
    // Restaurar datos que queremos conservar
    if (gameData) {
      localStorage.setItem(this.storageKeys.gameData, gameData);
    }
    if (theme) {
      localStorage.setItem(this.storageKeys.theme, theme);
    }
  }

  // ============================================
  // MÉTODOS DE PERSISTENCIA DEL JUEGO
  // ============================================

  /**
   * Guardar datos del juego
   */
  saveGameData(gameData) {
    try {
      const dataToSave = {
        ...gameData,
        lastSaved: Date.now(),
        version: '1.0' // Para futuras migraciones
      };
      
      localStorage.setItem(this.storageKeys.gameData, JSON.stringify(dataToSave));
      return true;
    } catch (error) {
      console.error('Error guardando datos del juego:', error);
      return false;
    }
  }

  /**
   * Cargar datos del juego
   */
  loadGameData() {
    try {
      const savedData = localStorage.getItem(this.storageKeys.gameData);
      
      if (!savedData) {
        return this.getDefaultGameData();
      }

      const parsedData = JSON.parse(savedData);
      
      // Validar estructura de datos
      if (!this.isValidGameData(parsedData)) {
        console.warn('Datos del juego inválidos, usando valores por defecto');
        return this.getDefaultGameData();
      }

      // Aplicar degradación temporal si es necesario
      return this.applyTimeBasedDecay(parsedData);
      
    } catch (error) {
      console.error('Error cargando datos del juego:', error);
      return this.getDefaultGameData();
    }
  }

  /**
   * Obtener datos por defecto del juego
   */
  getDefaultGameData() {
    return {
      catStats: {
        energia: 50,
        entretenimiento: 50,
        carino: 50,
        diversion: 50
      },
      catMood: 'neutro',
      achievements: [],
      totalInteractions: 0,
      totalPlayTime: 0,
      lastUpdate: Date.now(),
      lastSaved: Date.now(),
      createdAt: Date.now(),
      version: '1.0'
    };
  }

  /**
   * Validar estructura de datos del juego
   */
  isValidGameData(data) {
    if (!data || typeof data !== 'object') return false;
    
    // Verificar que existan las propiedades esenciales
    const requiredProps = ['catStats', 'catMood', 'achievements', 'lastUpdate'];
    const hasRequiredProps = requiredProps.every(prop => prop in data);
    
    if (!hasRequiredProps) return false;
    
    // Verificar estructura de catStats
    const requiredStats = ['energia', 'entretenimiento', 'carino', 'diversion'];
    const hasValidStats = requiredStats.every(stat => 
      stat in data.catStats && 
      typeof data.catStats[stat] === 'number' &&
      data.catStats[stat] >= 0 && 
      data.catStats[stat] <= 100
    );
    
    return hasValidStats;
  }

  /**
   * Aplicar degradación basada en tiempo ausente
   */
  applyTimeBasedDecay(data) {
    const now = Date.now();
    const lastUpdate = data.lastUpdate || now;
    const timeDiff = now - lastUpdate;
    
    // Si han pasado menos de 5 minutos, no aplicar degradación
    if (timeDiff < 5 * 60 * 1000) {
      return data;
    }

    // Calcular degradación (cada hora que pasa, reduce las stats)
    const hoursAway = Math.floor(timeDiff / (60 * 60 * 1000));
    const decayPerHour = 2; // 2% por hora
    const maxDecay = 30; // Máximo 30% de degradación total
    
    const totalDecay = Math.min(hoursAway * decayPerHour, maxDecay);
    
    const updatedStats = {
      energia: Math.max(0, data.catStats.energia - totalDecay),
      entretenimiento: Math.max(0, data.catStats.entretenimiento - Math.floor(totalDecay * 0.8)),
      carino: Math.max(0, data.catStats.carino - Math.floor(totalDecay * 0.6)),
      diversion: Math.max(0, data.catStats.diversion - Math.floor(totalDecay * 0.8))
    };

    return {
      ...data,
      catStats: updatedStats,
      lastUpdate: now,
      timeAwayHours: hoursAway
    };
  }

  /**
   * Obtener estadísticas de tiempo de juego
   */
  getGameStats() {
    const data = this.loadGameData();
    const now = Date.now();
    
    return {
      totalPlayTime: data.totalPlayTime || 0,
      daysSinceCreated: Math.floor((now - (data.createdAt || now)) / (24 * 60 * 60 * 1000)),
      totalInteractions: data.totalInteractions || 0,
      achievementsUnlocked: data.achievements ? data.achievements.length : 0,
      lastPlayedDaysAgo: Math.floor((now - (data.lastUpdate || now)) / (24 * 60 * 60 * 1000))
    };
  }

  /**
   * Actualizar tiempo de juego
   */
  updatePlayTime(additionalTime) {
    const data = this.loadGameData();
    data.totalPlayTime = (data.totalPlayTime || 0) + additionalTime;
    data.lastUpdate = Date.now();
    this.saveGameData(data);
  }

  /**
   * Incrementar contador de interacciones
   */
  incrementInteractions(count = 1) {
    const data = this.loadGameData();
    data.totalInteractions = (data.totalInteractions || 0) + count;
    data.lastUpdate = Date.now();
    this.saveGameData(data);
  }

  // ============================================
  // MÉTODOS DE EXPORTACIÓN E IMPORTACIÓN
  // ============================================

  /**
   * Exportar datos del juego para respaldo
   */
  exportGameData() {
    try {
      const data = this.loadGameData();
      const exportData = {
        ...data,
        exportDate: Date.now(),
        exportVersion: '1.0'
      };
      
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exportando datos:', error);
      return null;
    }
  }

  /**
   * Importar datos del juego desde respaldo
   */
  importGameData(jsonData) {
    try {
      const importedData = JSON.parse(jsonData);
      
      if (!this.isValidGameData(importedData)) {
        throw new Error('Datos importados inválidos');
      }
      
      // Actualizar timestamp de importación
      importedData.lastUpdate = Date.now();
      importedData.importedAt = Date.now();
      
      this.saveGameData(importedData);
      return true;
    } catch (error) {
      console.error('Error importando datos:', error);
      return false;
    }
  }

  /**
   * Crear respaldo automático
   */
  createBackup() {
    try {
      const backupData = this.loadGameData();
      const backupKey = `${this.storageKeys.gameData}_backup_${Date.now()}`;
      localStorage.setItem(backupKey, JSON.stringify(backupData));
      
      // Mantener solo los últimos 3 respaldos
      this.cleanOldBackups();
      
      return true;
    } catch (error) {
      console.error('Error creando respaldo:', error);
      return false;
    }
  }

  /**
   * Limpiar respaldos antiguos
   */
  cleanOldBackups() {
    try {
      const backupKeys = [];
      
      // Encontrar todas las claves de respaldo
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`${this.storageKeys.gameData}_backup_`)) {
          backupKeys.push({
            key,
            timestamp: parseInt(key.split('_').pop())
          });
        }
      }
      
      // Ordenar por timestamp (más reciente primero)
      backupKeys.sort((a, b) => b.timestamp - a.timestamp);
      
      // Eliminar respaldos extras (mantener solo 3)
      backupKeys.slice(3).forEach(backup => {
        localStorage.removeItem(backup.key);
      });
    } catch (error) {
      console.error('Error limpiando respaldos:', error);
    }
  }

  // ============================================
  // MÉTODOS DE UTILIDAD
  // ============================================

  /**
   * Obtener información de almacenamiento
   */
  getStorageInfo() {
    try {
      const used = new Blob(Object.values(localStorage)).size;
      const quota = 5 * 1024 * 1024; // 5MB típico para localStorage
      
      return {
        used: used,
        usedMB: (used / (1024 * 1024)).toFixed(2),
        quota: quota,
        quotaMB: (quota / (1024 * 1024)).toFixed(2),
        percentUsed: ((used / quota) * 100).toFixed(1)
      };
    } catch (error) {
      console.error('Error obteniendo info de almacenamiento:', error);
      return null;
    }
  }

  /**
   * Limpiar todos los datos
   */
  clearAllData() {
    try {
      Object.values(this.storageKeys).forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Limpiar también respaldos
      this.cleanOldBackups();
      
      return true;
    } catch (error) {
      console.error('Error limpiando datos:', error);
      return false;
    }
  }

  /**
   * Verificar si localStorage está disponible
   */
  isStorageAvailable() {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }
}

// ============================================
// INSTANCIA SINGLETON
// ============================================

const authService = new AuthService();

// ============================================
// EXPORTACIÓN PRINCIPAL
// ============================================

export default authService;