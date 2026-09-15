import { INITIAL_PHRASES, autoGeneratePhonetic } from '../data/cefrData';

const STORAGE_KEYS = {
  USER_LEVEL: 'eco_eng_level',
  PHRASES: 'eco_eng_phrases',
  STREAK: 'eco_eng_streak',
  LAST_LESSON_DATE: 'eco_eng_last_lesson_date',
  COMPLETED_LESSONS: 'eco_eng_completed_lessons',
  STATS: 'eco_eng_stats',
  XP: 'eco_eng_xp'
};

/**
 * Universal Storage Helper (works in Chrome Extension & Browser Web Mode)
 */
export const storageService = {
  async get(key, defaultValue = null) {
    // Fallback key for backwards compatibility
    const oldKey = key.replace('eco_eng_', 'vibe_eng_');

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      return new Promise((resolve) => {
        chrome.storage.local.get([key, oldKey], (result) => {
          if (result[key] !== undefined) {
            resolve(result[key]);
          } else if (result[oldKey] !== undefined) {
            resolve(result[oldKey]);
          } else {
            resolve(defaultValue);
          }
        });
      });
    } else {
      let val = localStorage.getItem(key);
      if (val === null) val = localStorage.getItem(oldKey);
      if (val === null) return defaultValue;
      try {
        return JSON.parse(val);
      } catch {
        return val;
      }
    }
  },

  async set(key, value) {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, () => {
          resolve(true);
        });
      });
    } else {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    }
  },

  // Initialize Default App Data
  async initData() {
    let phrases = await this.get(STORAGE_KEYS.PHRASES);
    if (!phrases || !Array.isArray(phrases) || phrases.length === 0) {
      phrases = INITIAL_PHRASES;
      await this.set(STORAGE_KEYS.PHRASES, phrases);
    } else {
      // Auto-sync missing items & context/phonetic metadata from INITIAL_PHRASES
      let hasChanges = false;

      INITIAL_PHRASES.forEach(initItem => {
        if (!phrases.some(p => p.id === initItem.id)) {
          phrases.push(initItem);
          hasChanges = true;
        }
      });

      phrases = phrases.map(p => {
        const initMatch = INITIAL_PHRASES.find(item => item.id === p.id);
        let updated = { ...p };

        if (initMatch) {
          if (!p.context || p.context !== initMatch.context) {
            updated.context = initMatch.context;
            hasChanges = true;
          }
          if (!p.phonetic || p.phonetic !== initMatch.phonetic) {
            updated.phonetic = initMatch.phonetic;
            hasChanges = true;
          }
        } else {
          // Custom phrases: if phonetic is missing, auto-generate it!
          if (!p.phonetic && p.phrase) {
            updated.phonetic = autoGeneratePhonetic(p.phrase);
            hasChanges = true;
          }
        }
        return updated;
      });

      if (hasChanges) {
        await this.set(STORAGE_KEYS.PHRASES, phrases);
      }
    }

    let level = await this.get(STORAGE_KEYS.USER_LEVEL);
    if (!level) {
      level = 'B1';
      await this.set(STORAGE_KEYS.USER_LEVEL, level);
    }

    let streak = await this.get(STORAGE_KEYS.STREAK, 1);
    let completedLessons = await this.get(STORAGE_KEYS.COMPLETED_LESSONS, []);
    let xp = await this.get(STORAGE_KEYS.XP, 0);

    return { phrases, level, streak, completedLessons, xp };
  },

  // User Level Management
  async getUserLevel() {
    return await this.get(STORAGE_KEYS.USER_LEVEL, 'B1');
  },

  async setUserLevel(level) {
    return await this.set(STORAGE_KEYS.USER_LEVEL, level);
  },

  // Phrases Management
  async getPhrases() {
    const phrases = await this.get(STORAGE_KEYS.PHRASES, INITIAL_PHRASES);
    return Array.isArray(phrases) ? phrases : INITIAL_PHRASES;
  },

  async addPhrase(newPhrase) {
    const phrases = await this.getPhrases();
    const cleanNew = (newPhrase.phrase || '').trim().toLowerCase();

    // Prevent adding duplicate phrase (case-insensitive)
    if (cleanNew && phrases.some(p => p.phrase && p.phrase.trim().toLowerCase() === cleanNew)) {
      console.warn(`Phrase "${newPhrase.phrase}" already exists in storage. Duplicate prevented.`);
      return phrases;
    }

    const phraseObj = {
      id: `custom-${Date.now()}`,
      phrase: newPhrase.phrase.trim(),
      phonetic: newPhrase.phonetic || '',
      meaning: newPhrase.meaning,
      context: newPhrase.context || 'Giao tiếp hàng ngày',
      level: newPhrase.level || 'B1',
      type: newPhrase.type || 'Custom Phrase',
      example: newPhrase.example || '',
      vietnameseTranslation: newPhrase.vietnameseTranslation || '',
      tags: newPhrase.tags || ['Custom'],
      masteryLevel: 0,
      nextReviewDate: new Date().toISOString()
    };
    const updated = [phraseObj, ...phrases];
    await this.set(STORAGE_KEYS.PHRASES, updated);
    return updated;
  },

  async updatePhraseMastery(phraseId, isCorrect) {
    const phrases = await this.getPhrases();
    const updated = phrases.map(p => {
      if (p.id === phraseId) {
        const currentMastery = p.masteryLevel || 0;
        const newMastery = isCorrect ? Math.min(5, currentMastery + 1) : Math.max(0, currentMastery - 1);
        return {
          ...p,
          masteryLevel: newMastery,
          lastReviewed: new Date().toISOString()
        };
      }
      return p;
    });
    await this.set(STORAGE_KEYS.PHRASES, updated);
    return updated;
  },

  async deletePhrase(phraseId) {
    const phrases = await this.getPhrases();
    const updated = phrases.filter(p => p.id !== phraseId);
    await this.set(STORAGE_KEYS.PHRASES, updated);
    return updated;
  },

  async updatePhrase(phraseId, updatedData) {
    const phrases = await this.getPhrases();
    const updated = phrases.map(p => {
      if (p.id === phraseId) {
        return {
          ...p,
          phrase: updatedData.phrase !== undefined ? updatedData.phrase : p.phrase,
          phonetic: updatedData.phonetic !== undefined ? updatedData.phonetic : p.phonetic,
          meaning: updatedData.meaning !== undefined ? updatedData.meaning : p.meaning,
          context: updatedData.context !== undefined ? updatedData.context : p.context,
          level: updatedData.level !== undefined ? updatedData.level : p.level,
          type: updatedData.type !== undefined ? updatedData.type : p.type,
          example: updatedData.example !== undefined ? updatedData.example : p.example,
          vietnameseTranslation: updatedData.vietnameseTranslation !== undefined ? updatedData.vietnameseTranslation : p.vietnameseTranslation,
          tags: Array.isArray(updatedData.tags) ? updatedData.tags : (updatedData.tags ? updatedData.tags.split(',').map(t => t.trim()) : p.tags)
        };
      }
      return p;
    });
    await this.set(STORAGE_KEYS.PHRASES, updated);
    return updated;
  },

  // Streak & Progress Tracking (Tích lũy ngày học - Tự động cộng +1 ngày mới)
  async updateStreak() {
    const todayStr = new Date().toDateString();
    const lastDate = await this.get(STORAGE_KEYS.LAST_LESSON_DATE, null);
    let streak = await this.get(STORAGE_KEYS.STREAK, 1);

    if (!lastDate) {
      // First day installing / initializing app
      await this.set(STORAGE_KEYS.LAST_LESSON_DATE, todayStr);
      await this.set(STORAGE_KEYS.STREAK, streak);
    } else if (lastDate !== todayStr) {
      // New active day -> Automatically increment streak by +1 day!
      streak += 1;
      await this.set(STORAGE_KEYS.STREAK, streak);
      await this.set(STORAGE_KEYS.LAST_LESSON_DATE, todayStr);
    }
    return streak;
  },

  // XP Accumulation & Persistence
  async addXP(amount = 10) {
    const current = await this.get(STORAGE_KEYS.XP, 0);
    const updated = current + amount;
    await this.set(STORAGE_KEYS.XP, updated);
    return updated;
  }
};
