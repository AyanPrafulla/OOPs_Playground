/**
 * OOPs Playground - Learning Progress Manager
 * Safely tracks completed lessons, quiz scores, and interactive milestones.
 * Uses LocalStorage when available, falling back gracefully to memory state.
 */

const ProgressManager = (() => {
  const STORAGE_KEY = 'oops_playground_progress_v1';
  const TOTAL_LESSONS = 5;
  const LESSON_IDS = ['classes-objects', 'inheritance', 'encapsulation', 'polymorphism', 'abstraction'];

  // Default empty state
  const defaultState = {
    completedLessons: {},
    knowledgeChecks: {},
    quizAttempts: 0,
    latestQuizScore: null,
    bestQuizScore: null,
    simulationsTested: {}
  };

  let state = { ...defaultState };
  let isStorageAvailable = false;
  const listeners = [];

  // Check LocalStorage availability
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    isStorageAvailable = true;
  } catch (e) {
    console.warn('[ProgressManager] LocalStorage unavailable; using in-memory session persistence.');
    isStorageAvailable = false;
  }

  // Load persisted state
  function loadState() {
    if (!isStorageAvailable) return;
    try {
      const serialized = window.localStorage.getItem(STORAGE_KEY);
      if (serialized) {
        const parsed = JSON.parse(serialized);
        state = {
          ...defaultState,
          ...parsed,
          completedLessons: parsed.completedLessons || {},
          knowledgeChecks: parsed.knowledgeChecks || {},
          simulationsTested: parsed.simulationsTested || {}
        };
      }
    } catch (e) {
      console.warn('[ProgressManager] Failed to parse stored progress:', e);
    }
  }

  // Save state
  function saveState() {
    if (isStorageAvailable) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.warn('[ProgressManager] Failed to persist progress to LocalStorage:', e);
      }
    }
    notifyListeners();
  }

  function notifyListeners() {
    const stats = getStats();
    listeners.forEach(fn => {
      try {
        fn(stats);
      } catch (err) {
        console.error('[ProgressManager] Listener callback error:', err);
      }
    });
  }

  function markLessonComplete(lessonId) {
    if (!state.completedLessons[lessonId]) {
      state.completedLessons[lessonId] = true;
      saveState();
    }
  }

  function toggleLessonComplete(lessonId) {
    state.completedLessons[lessonId] = !state.completedLessons[lessonId];
    saveState();
  }

  function isLessonComplete(lessonId) {
    return !!state.completedLessons[lessonId];
  }

  function recordKnowledgeCheck(lessonId, isCorrect) {
    state.knowledgeChecks[lessonId] = isCorrect;
    if (isCorrect) {
      markLessonComplete(lessonId);
    } else {
      saveState();
    }
  }

  function recordSimulationTested(simId) {
    if (!state.simulationsTested[simId]) {
      state.simulationsTested[simId] = true;
      saveState();
    }
  }

  function recordQuizScore(score, total) {
    const percentage = Math.round((score / total) * 100);
    const scoreRecord = {
      score,
      total,
      percentage,
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    state.quizAttempts = (state.quizAttempts || 0) + 1;
    state.latestQuizScore = scoreRecord;

    if (!state.bestQuizScore || scoreRecord.percentage > state.bestQuizScore.percentage) {
      state.bestQuizScore = scoreRecord;
    }

    saveState();
  }

  function getStats() {
    const completedCount = LESSON_IDS.filter(id => state.completedLessons[id]).length;
    const completionPercentage = Math.round((completedCount / TOTAL_LESSONS) * 100);
    const simulationsCount = Object.keys(state.simulationsTested).length;

    return {
      totalLessons: TOTAL_LESSONS,
      completedCount,
      completionPercentage,
      completedLessons: { ...state.completedLessons },
      knowledgeChecks: { ...state.knowledgeChecks },
      simulationsTestedCount: simulationsCount,
      quizAttempts: state.quizAttempts || 0,
      latestQuizScore: state.latestQuizScore,
      bestQuizScore: state.bestQuizScore
    };
  }

  function resetAll() {
    state = {
      completedLessons: {},
      knowledgeChecks: {},
      quizAttempts: 0,
      latestQuizScore: null,
      bestQuizScore: null,
      simulationsTested: {}
    };
    if (isStorageAvailable) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.warn('[ProgressManager] Reset failed in LocalStorage:', e);
      }
    }
    notifyListeners();
  }

  function subscribe(fn) {
    if (typeof fn === 'function') {
      listeners.push(fn);
      // Immediately notify newly registered listener
      fn(getStats());
    }
  }

  // Initialize
  loadState();

  return {
    markLessonComplete,
    toggleLessonComplete,
    isLessonComplete,
    recordKnowledgeCheck,
    recordSimulationTested,
    recordQuizScore,
    getStats,
    resetAll,
    subscribe,
    LESSON_IDS
  };
})();
