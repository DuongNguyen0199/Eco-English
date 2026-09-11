import { createClient } from '@supabase/supabase-js';
import { storageService } from './storageService';

const DEFAULT_SUPABASE_URL = 'https://aaimwnthemplgnlcpfdm.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhaW13bnRoZW1wbGdubGNwZmRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxMzk1MDgsImV4cCI6MjEwNDcxNTUwOH0.mB-Vkzj4neKPpRMdiG5QlOhdQdrRRGvE1r4ARPI89TU';

// Initialize Supabase Client
export const supabase = createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);

const STORAGE_KEYS = {
  USER_ID: 'eco_eng_user_id',
  NICKNAME: 'eco_eng_nickname',
  AVATAR: 'eco_eng_avatar'
};

export const supabaseService = {
  // Get or Create Persistent User UUID
  async getUserId() {
    let userId = await storageService.get(STORAGE_KEYS.USER_ID, null);
    if (!userId) {
      userId = 'usr_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      await storageService.set(STORAGE_KEYS.USER_ID, userId);
    }
    return userId;
  },

  // Get User Display Profile (Nickname & Avatar)
  async getUserProfile() {
    const nickname = await storageService.get(STORAGE_KEYS.NICKNAME, 'Học Viên Eco');
    const avatar = await storageService.get(STORAGE_KEYS.AVATAR, '🎓');
    return { nickname, avatar };
  },

  // Save User Display Profile
  async setUserProfile(nickname, avatar = '🎓') {
    await storageService.set(STORAGE_KEYS.NICKNAME, nickname);
    await storageService.set(STORAGE_KEYS.AVATAR, avatar);
    return { nickname, avatar };
  },

  // Check if a display name is taken by another user in Supabase
  async isDisplayNameTaken(displayName, currentUserId) {
    try {
      if (!displayName || !displayName.trim()) return false;
      const cleanName = displayName.trim();

      const { data, error } = await supabase
        .from('user_progress')
        .select('id, display_name');

      if (error || !data) return false;

      const duplicate = data.find(item => 
        item.id !== currentUserId && 
        item.display_name && 
        item.display_name.trim().toLowerCase() === cleanName.toLowerCase()
      );

      return !!duplicate;
    } catch (err) {
      console.warn('Error checking display name uniqueness:', err.message);
      return false;
    }
  },

  // Sync Current User Progress (XP, Streak, Level) to Supabase
  async syncUserProgress({ xp = 0, streak = 1, userLevel = 'B1' }) {
    try {
      const userId = await this.getUserId();
      const { nickname, avatar } = await this.getUserProfile();

      const payload = {
        id: userId,
        display_name: nickname,
        xp: Number(xp),
        streak: Number(streak),
        user_level: userLevel,
        avatar: avatar,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('user_progress')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        console.warn('Supabase sync warning:', error.message);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (err) {
      console.warn('Supabase sync exception:', err.message);
      return { success: false, error: err.message };
    }
  },

  // Fetch Leaderboard (Top 20 players ordered by XP)
  async getLeaderboard() {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .order('xp', { ascending: false })
        .limit(20);

      if (error || !data) {
        console.warn('Could not fetch leaderboard:', error?.message);
        return [];
      }

      return data;
    } catch (err) {
      console.warn('Error fetching leaderboard:', err.message);
      return [];
    }
  },

  // Sync Vault Phrases to Supabase
  async syncPhrasesVault(phrases = []) {
    try {
      if (!Array.isArray(phrases) || phrases.length === 0) return { success: true };

      const userId = await this.getUserId();
      const records = phrases.map(p => ({
        id: p.id,
        user_id: userId,
        phrase: p.phrase || '',
        phonetic: p.phonetic || '',
        meaning: p.meaning || '',
        context: p.context || '',
        level: p.level || 'B1',
        type: p.type || 'Collocation',
        example: p.example || '',
        vietnamese_translation: p.vietnameseTranslation || '',
        mastery_level: Number(p.masteryLevel || 0),
        updated_at: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('phrases_vault')
        .upsert(records, { onConflict: 'id' });

      if (error) {
        console.warn('Supabase phrase vault sync warning:', error.message);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (err) {
      console.warn('Supabase phrase vault sync exception:', err.message);
      return { success: false, error: err.message };
    }
  }
};
