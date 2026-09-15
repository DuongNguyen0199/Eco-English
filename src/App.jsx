import React, { useState, useEffect } from 'react';
import SidePanelLayout from './components/SidePanelLayout';
import { storageService } from './services/storageService';
import { INITIAL_PHRASES } from './data/cefrData';

import { supabaseService } from './services/supabaseService';

export default function App() {
  const [userLevel, setUserLevel] = useState('B1');
  const [phrases, setPhrases] = useState(INITIAL_PHRASES);
  const [streak, setStreak] = useState(1);
  const [xp, setXp] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { phrases: storedPhrases, level, streak: storedStreak, xp: storedXP } = await storageService.initData();
      setPhrases(storedPhrases);
      setUserLevel(level);

      // Auto check & increment streak on new day launch!
      const activeStreak = await storageService.updateStreak();
      setStreak(activeStreak);

      setXp(storedXP || 0);
      setLoading(false);

      // Initial Sync to Supabase Cloud
      supabaseService.syncUserProgress({ xp: storedXP || 0, streak: activeStreak, userLevel: level });
      supabaseService.syncPhrasesVault(storedPhrases);
    }
    loadData();
  }, []);

  // Auto-sync whenever progress or phrases change
  useEffect(() => {
    if (!loading) {
      supabaseService.syncUserProgress({ xp, streak, userLevel });
      supabaseService.syncPhrasesVault(phrases);
    }
  }, [xp, streak, userLevel, phrases, loading]);

  const handleLevelChange = async (newLevel) => {
    setUserLevel(newLevel);
    await storageService.setUserLevel(newLevel);
  };

  const handleAddPhrase = async (phraseObj) => {
    const updated = await storageService.addPhrase(phraseObj);
    setPhrases(updated);
  };

  const handleDeletePhrase = async (phraseId) => {
    const updated = await storageService.deletePhrase(phraseId);
    setPhrases(updated);
  };

  const handleEditPhrase = async (phraseId, updatedObj) => {
    const updated = await storageService.updatePhrase(phraseId, updatedObj);
    setPhrases(updated);
  };

  const handleUpdateMastery = async (phraseId, isCorrect) => {
    const updated = await storageService.updatePhraseMastery(phraseId, isCorrect);
    setPhrases(updated);
    const activeStreak = await storageService.updateStreak();
    setStreak(activeStreak);
  };

  const handleFinishLesson = async () => {
    const newStreak = await storageService.updateStreak();
    setStreak(newStreak);
  };

  const handleAddXP = async (amount = 10) => {
    const newXP = await storageService.addXP(amount);
    setXp(newXP);
    const activeStreak = await storageService.updateStreak();
    setStreak(activeStreak);
  };

  const handleResetData = async () => {
    await storageService.set('eco_eng_phrases', INITIAL_PHRASES);
    setPhrases(INITIAL_PHRASES);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400 font-semibold">Đang tải Eco English Extension...</p>
        </div>
      </div>
    );
  }

  return (
    <SidePanelLayout
      userLevel={userLevel}
      onLevelChange={handleLevelChange}
      phrases={phrases}
      streak={streak}
      xp={xp}
      onAddXP={handleAddXP}
      onAddPhrase={handleAddPhrase}
      onDeletePhrase={handleDeletePhrase}
      onEditPhrase={handleEditPhrase}
      onUpdateMastery={handleUpdateMastery}
      onFinishLesson={handleFinishLesson}
      onResetData={handleResetData}
    />
  );
}
