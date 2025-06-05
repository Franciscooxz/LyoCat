import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Heart, Zap, Tv, Coffee, Award, RotateCcw, LogOut, Download, Upload } from 'lucide-react';
import Confetti from 'react-confetti';
import CatComponent from './components/CatComponent';
import LoginScreen from './components/LoginScreen';
import ChatInterface from './components/ChatInterface';
import authService from './services/authService';
import './App.css';

function App() {
  // Estados de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Estados principales del Tamagotchi
  const [catStats, setCatStats] = useState({
    energia: 50,
    entretenimiento: 50,
    carino: 50,
    diversion: 50
  });

  const [catMood, setCatMood] = useState('neutro');
  const [darkMode, setDarkMode] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [totalInteractions, setTotalInteractions] = useState(0);
  
  // Estados del chat
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Lista completa de logros disponibles - usando useMemo para evitar re-renders
  const availableAchievements = useMemo(() => [
    { 
      id: 'first_friend', 
      name: '첫 번째 친구', 
      description: '10번 상호작용', 
      requirement: 'interactions', 
      target: 10 
    },
    { 
      id: 'full_energy', 
      name: '완전 충전', 
      description: '에너지 100%', 
      requirement: 'energia', 
      target: 100 
    },
    { 
      id: 'perfect_balance', 
      name: '완벽한 균형', 
      description: '모든 스탯 80% 이상', 
      requirement: 'balance', 
      target: 80 
    },
    { 
      id: 'drama_lover', 
      name: '드라마 중독', 
      description: '엔터테인먼트 95% 이상', 
      requirement: 'entretenimiento', 
      target: 95 
    },
    { 
      id: 'best_friend', 
      name: '베스트 프렌드', 
      description: '사랑 100%', 
      requirement: 'carino', 
      target: 100 
    },
    { 
      id: 'party_animal', 
      name: '파티 동물', 
      description: '재미 95% 이상', 
      requirement: 'diversion', 
      target: 95 
    },
    {
      id: 'social_butterfly',
      name: '사교적 나비',
      description: '100번 상호작용',
      requirement: 'interactions',
      target: 100
    },
    {
      id: 'chat_master',
      name: '채팅 마스터',
      description: '50번 채팅',
      requirement: 'chat_messages',
      target: 50
    }
  ], []);

  // Verificar autenticación al cargar la app
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      const user = authService.getCurrentUser();
      
      setIsAuthenticated(authenticated);
      setCurrentUser(user);
      setIsLoadingAuth(false);
    };

    checkAuth();
  }, []);

  // Cargar datos del juego desde localStorage
  const loadGameData = useCallback(() => {
    const savedData = authService.loadGameData();
    
    setCatStats(savedData.catStats);
    setCatMood(savedData.catMood || 'neutro');
    setAchievements(savedData.achievements || []);
    setLastUpdate(savedData.lastUpdate || Date.now());
    setTotalInteractions(savedData.totalInteractions || 0);
    
    // Mostrar mensaje si el usuario estuvo ausente
    if (savedData.timeAwayHours && savedData.timeAwayHours > 1) {
      setTimeout(() => {
        alert(`¡Bienvenido de vuelta! Tu gatito te extrañó. Estuviste ausente ${savedData.timeAwayHours} horas.`);
      }, 1000);
    }
  }, []);

  // Cargar preferencia de tema
  const loadThemePreference = useCallback(() => {
    const savedTheme = localStorage.getItem('catTamagotchi_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else {
      setDarkMode(prefersDark);
    }
  }, []);

  // Cargar datos del juego cuando el usuario se autentica
  useEffect(() => {
    if (isAuthenticated) {
      loadGameData();
      loadThemePreference();
    }
  }, [isAuthenticated, loadGameData, loadThemePreference]);

  // Guardar datos del juego automáticamente
  const saveGameData = useCallback(() => {
    if (!isAuthenticated) return;

    const gameData = {
      catStats,
      catMood,
      achievements,
      lastUpdate,
      totalInteractions
    };

    authService.saveGameData(gameData);
  }, [isAuthenticated, catStats, catMood, achievements, lastUpdate, totalInteractions]);

  // Auto-guardar cada 30 segundos
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(saveGameData, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, saveGameData]);

  // Guardar al cerrar la ventana
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isAuthenticated) {
        saveGameData();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isAuthenticated, saveGameData]);

  // Aplicar tema al documento
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('catTamagotchi_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Función para determinar el humor del gato
  const calculateMood = useCallback((stats) => {
    const average = (stats.energia + stats.entretenimiento + stats.carino + stats.diversion) / 4;
    
    if (average >= 90) return 'superFeliz';
    if (average >= 70) return 'feliz';
    if (average >= 40) return 'neutro';
    if (average >= 20) return 'triste';
    return 'muySad';
  }, []);

  // Sistema de degradación automática
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeDiff = now - lastUpdate;
      
      // Degradar cada 2 minutos
      if (timeDiff >= 120000) {
        setCatStats(prevStats => {
          const newStats = {
            energia: Math.max(0, prevStats.energia - 2),
            entretenimiento: Math.max(0, prevStats.entretenimiento - 1),
            carino: Math.max(0, prevStats.carino - 1),
            diversion: Math.max(0, prevStats.diversion - 1)
          };
          
          return newStats;
        });
        
        setLastUpdate(now);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, lastUpdate]);

  // Actualizar humor cuando cambien las estadísticas
  useEffect(() => {
    const newMood = calculateMood(catStats);
    const previousMood = catMood;
    setCatMood(newMood);
    
    // Activar confetti cuando mejora significativamente
    if (newMood === 'superFeliz' && previousMood !== 'superFeliz') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [catStats, calculateMood, catMood]);

  // Sistema de verificación de logros (incluye logro de chat)
  useEffect(() => {
    if (!isAuthenticated) return;

    // Obtener estadísticas de chat para el logro
    const chatHistory = JSON.parse(localStorage.getItem('catTamagotchi_chatHistory') || '[]');
    const chatMessageCount = chatHistory.length;

    availableAchievements.forEach(achievement => {
      if (!achievements.includes(achievement.id)) {
        let unlocked = false;
        
        switch (achievement.requirement) {
          case 'energia':
            unlocked = catStats.energia >= achievement.target;
            break;
          case 'entretenimiento':
            unlocked = catStats.entretenimiento >= achievement.target;
            break;
          case 'carino':
            unlocked = catStats.carino >= achievement.target;
            break;
          case 'diversion':
            unlocked = catStats.diversion >= achievement.target;
            break;
          case 'interactions':
            unlocked = totalInteractions >= achievement.target;
            break;
          case 'chat_messages':
            unlocked = chatMessageCount >= achievement.target;
            break;
          case 'balance':
            unlocked = Object.values(catStats).every(stat => stat >= achievement.target);
            break;
          default:
            break;
        }
        
        if (unlocked) {
          setAchievements(prev => [...prev, achievement.id]);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 2000);
        }
      }
    });
  }, [isAuthenticated, catStats, totalInteractions, achievements, availableAchievements]);

  // Funciones de acción del juego
  const incrementInteraction = useCallback(() => {
    setTotalInteractions(prev => prev + 1);
    authService.incrementInteractions(1);
  }, []);

  const feedRedBull = useCallback(() => {
    setCatStats(prev => ({
      ...prev,
      energia: Math.min(100, prev.energia + 25)
    }));
    setLastUpdate(Date.now());
    incrementInteraction();
  }, [incrementInteraction]);

  const watchKDrama = useCallback(() => {
    setCatStats(prev => ({
      ...prev,
      entretenimiento: Math.min(100, prev.entretenimiento + 20)
    }));
    setLastUpdate(Date.now());
    incrementInteraction();
    
    // Activar recomendación de K-drama
    if (window.CatComponentRef && window.CatComponentRef.showDramaRecommendation) {
      window.CatComponentRef.showDramaRecommendation();
    }
  }, [incrementInteraction]);

  const showLove = useCallback(() => {
    setCatStats(prev => ({
      ...prev,
      carino: Math.min(100, prev.carino + 15)
    }));
    setLastUpdate(Date.now());
    incrementInteraction();
  }, [incrementInteraction]);

  const playGame = useCallback(() => {
    setCatStats(prev => ({
      ...prev,
      diversion: Math.min(100, prev.diversion + 20)
    }));
    setLastUpdate(Date.now());
    incrementInteraction();
  }, [incrementInteraction]);

  const resetStats = useCallback(() => {
    const confirmMessage = '정말로 모든 통계를 재설정하시겠습니까?\n¿Seguro que quieres resetear todas las estadísticas?';
    
    if (window.confirm(confirmMessage)) {
      setCatStats({
        energia: 50,
        entretenimiento: 50,
        carino: 50,
        diversion: 50
      });
      setAchievements([]);
      setCatMood('neutro');
      setLastUpdate(Date.now());
      setTotalInteractions(0);
      
      // Crear respaldo antes del reset
      authService.createBackup();
    }
  }, []);

  // Funciones de UI
  const toggleTheme = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  const toggleChat = useCallback(() => {
    setIsChatOpen(prev => !prev);
  }, []);

  const handleLogin = useCallback((username) => {
    setIsAuthenticated(true);
    setCurrentUser({ username, loginTime: Date.now() });
  }, []);

  const handleLogout = useCallback(() => {
    // Guardar antes de cerrar sesión
    saveGameData();
    
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    
    // Limpiar estados locales
    setCatStats({ energia: 50, entretenimiento: 50, carino: 50, diversion: 50 });
    setCatMood('neutro');
    setAchievements([]);
    setTotalInteractions(0);
    setLastUpdate(Date.now());
    setIsChatOpen(false);
  }, [saveGameData]);

  // Funciones de exportación/importación
  const handleExportData = useCallback(() => {
    const exportedData = authService.exportGameData();
    if (exportedData) {
      const blob = new Blob([exportedData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tamagotchi-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, []);

  const handleImportData = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const success = authService.importGameData(e.target.result);
      if (success) {
        loadGameData();
        alert('¡Datos importados exitosamente!');
      } else {
        alert('Error al importar los datos. Verifica que el archivo sea válido.');
      }
    };
    reader.readAsText(file);
  }, [loadGameData]);

  // Obtener estadísticas promedio
  const getAverageStats = useCallback(() => {
    return Math.round((catStats.energia + catStats.entretenimiento + catStats.carino + catStats.diversion) / 4);
  }, [catStats]);

  // Mostrar loading mientras se verifica autenticación
  if (isLoadingAuth) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-cat">🐱</div>
          <p>Cargando tu gatito...</p>
        </div>
      </div>
    );
  }

  // Mostrar pantalla de login si no está autenticado
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Pantalla principal del juego
  return (
    <div className="App">
      {/* Elementos decorativos */}
      <div className="korean-decoration top-left"></div>
      <div className="korean-decoration top-right"></div>
      <div className="korean-decoration bottom-left"></div>
      <div className="korean-decoration bottom-right"></div>

      {/* Confetti para celebraciones */}
      <AnimatePresence>
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
            gravity={0.3}
            colors={['#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf', '#74b9ff']}
          />
        )}
      </AnimatePresence>

      {/* Interfaz de Chat */}
      <ChatInterface 
        mood={catMood}
        stats={catStats}
        isOpen={isChatOpen}
        onToggle={toggleChat}
      />

      {/* Contenedor principal */}
      <motion.div 
        className="tamagotchi-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Header con controles */}
        <header className="app-header">
          <div className="header-controls">
            <button 
              className="theme-toggle" 
              onClick={toggleTheme}
              aria-label={darkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
            >
              {darkMode ? <Sun className="theme-toggle-icon" /> : <Moon className="theme-toggle-icon" />}
              <span>{darkMode ? '밝게' : '어둡게'}</span>
            </button>

            <div className="user-controls">
              <button 
                className="control-button"
                onClick={handleExportData}
                title="Exportar datos"
              >
                <Download size={16} />
              </button>
              
              <label className="control-button" title="Importar datos">
                <Upload size={16} />
                <input 
                  type="file" 
                  accept=".json"
                  onChange={handleImportData}
                  style={{ display: 'none' }}
                />
              </label>

              <button 
                className="control-button logout-btn"
                onClick={handleLogout}
                title="Cerrar sesión"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
          
          <h1 className="app-title">안녕하세요 MAIU</h1>
          <p className="app-subtitle">
            나는 당신이 가장 좋아하는 고양이입니다 • LYO
            <span className="mood-text">
              ({catMood === 'superFeliz' ? '매우 행복' : 
                catMood === 'feliz' ? '행복' : 
                catMood === 'neutro' ? '보통' : 
                catMood === 'triste' ? '슬픔' : '매우 슬픔'})
            </span>
          </p>
          <p className="user-welcome">안녕하세요, {currentUser?.username}님! 👋</p>
        </header>

        {/* Sección del gato */}
        <motion.div 
          className="cat-section"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <CatComponent 
            mood={catMood} 
            stats={catStats}
            darkMode={darkMode}
            onClick={showLove}
          />
        </motion.div>

        {/* Grid de estadísticas */}
        <div className="stats-container">
          <motion.div 
            className="stat-item energia"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="stat-label">
              <Zap className="stat-icon" />
              레드불 에너지
            </div>
            <div className="stat-bar">
              <div 
                className="stat-progress" 
                style={{ width: `${catStats.energia}%` }}
              ></div>
            </div>
            <span className="stat-value">{catStats.energia}%</span>
          </motion.div>

          <motion.div 
            className="stat-item entretenimiento"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <div className="stat-label">
              <Tv className="stat-icon" />
              K-드라마
            </div>
            <div className="stat-bar">
              <div 
                className="stat-progress" 
                style={{ width: `${catStats.entretenimiento}%` }}
              ></div>
            </div>
            <span className="stat-value">{catStats.entretenimiento}%</span>
          </motion.div>

          <motion.div 
            className="stat-item carino"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <div className="stat-label">
              <Heart className="stat-icon" />
              사랑
            </div>
            <div className="stat-bar">
              <div 
                className="stat-progress" 
                style={{ width: `${catStats.carino}%` }}
              ></div>
            </div>
            <span className="stat-value">{catStats.carino}%</span>
          </motion.div>

          <motion.div 
            className="stat-item diversion"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <div className="stat-label">
              <Coffee className="stat-icon" />
              재미
            </div>
            <div className="stat-bar">
              <div 
                className="stat-progress" 
                style={{ width: `${catStats.diversion}%` }}
              ></div>
            </div>
            <span className="stat-value">{catStats.diversion}%</span>
          </motion.div>
        </div>

        {/* Botones de acción */}
        <motion.div 
          className="action-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <button 
            className="action-button energia-btn" 
            onClick={feedRedBull}
            disabled={catStats.energia >= 100}
          >
            <Zap className="action-button-icon" />
            레드불 주기
          </button>
          
          <button 
            className="action-button entretenimiento-btn" 
            onClick={watchKDrama}
            disabled={catStats.entretenimiento >= 100}
          >
            <Tv className="action-button-icon" />
            드라마 보기
          </button>
          
          <button 
            className="action-button carino-btn" 
            onClick={showLove}
            disabled={catStats.carino >= 100}
          >
            <Heart className="action-button-icon" />
            사랑 표현
          </button>
          
          <button 
            className="action-button diversion-btn" 
            onClick={playGame}
            disabled={catStats.diversion >= 100}
          >
            <Coffee className="action-button-icon" />
            놀아주기
          </button>
        </motion.div>

        {/* Sistema de logros */}
        <motion.div 
          className="achievements"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <div className="achievements-title">
            <Award className="achievements-icon" />
            업적 • Logros ({achievements.length}/{availableAchievements.length})
          </div>
          <div className="achievement-list">
            {availableAchievements.map(achievement => (
              <div 
                key={achievement.id}
                className={`achievement-badge ${achievements.includes(achievement.id) ? 'unlocked' : 'locked'}`}
                title={achievement.description}
              >
                <span className="achievement-name">{achievement.name}</span>
                {achievements.includes(achievement.id) && <span className="achievement-check">✓</span>}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Información general y controles */}
        <motion.div 
          className="bottom-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.4 }}
        >
          <div className="general-info">
            <span>전체 상태: {getAverageStats()}%</span>
            <span>•</span>
            <span>상호작용: {totalInteractions}</span>
            <span>•</span>
            <span>마지막 업데이트: {new Date(lastUpdate).toLocaleTimeString()}</span>
          </div>

          <button 
            className="action-button reset-btn"
            onClick={resetStats}
          >
            <RotateCcw className="action-button-icon" />
            초기화 • Reset
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default App;