import { useState, useEffect } from 'react';
import { FlashcardData, Theme, DeckInfo } from '../types/flashcard';
import { validateFlashcardJson } from '../utils/validation';
import { v4 as uuidv4 } from 'uuid';

const DECKS_KEY = 'flashcard_decks';
const PROGRESS_KEY = 'flashcard_progress';

export const useFlashcards = () => {
  const [decks, setDecks] = useState<DeckInfo[]>(() => {
    const saved = localStorage.getItem(DECKS_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeDeck, setActiveDeck] = useState<DeckInfo | null>(null);
  const [currentThemeIndex, setCurrentThemeIndex] = useState<number>(0);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const [completedCards, setCompletedCards] = useState<Record<string, Set<string>>>(() => {
    const saved = localStorage.getItem(PROGRESS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return Object.fromEntries(
        Object.entries(parsed).map(([key, value]) => [key, new Set(value)])
      );
    }
    return {};
  });

  // Save decks to localStorage
  useEffect(() => {
    localStorage.setItem(DECKS_KEY, JSON.stringify(decks));
  }, [decks]);

  // Save progress to localStorage
  useEffect(() => {
    const serializable = Object.fromEntries(
      Object.entries(completedCards).map(([key, value]) => [key, Array.from(value)])
    );
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(serializable));
  }, [completedCards]);

  const loadFlashcards = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fileContent = await file.text();
      const jsonData = JSON.parse(fileContent);
      
      const validation = validateFlashcardJson(jsonData);
      
      if (!validation.valid) {
        setError(validation.message || 'Invalid JSON format');
        setIsLoading(false);
        return;
      }

      const totalCards = jsonData.themes.reduce(
        (sum: number, theme: Theme) => sum + theme.flashcards.length, 
        0
      );
      
      const newDeck: DeckInfo = {
        id: uuidv4(),
        name: file.name.replace('.json', ''),
        data: jsonData,
        lastAccessed: new Date().toISOString(),
        totalCards
      };

      setDecks(prev => [...prev, newDeck]);
      setActiveDeck(newDeck);
      setCurrentThemeIndex(0);
      setCurrentCardIndex(0);
      
      // Initialize completed cards tracking for new deck
      setCompletedCards(prev => ({
        ...prev,
        [newDeck.id]: new Set()
      }));
    } catch (err) {
      setError('Failed to parse JSON file');
    } finally {
      setIsLoading(false);
    }
  };

  const selectDeck = (deckId: string) => {
    if (!deckId) {
      // Reset/clear the active deck
      setActiveDeck(null);
      setCurrentThemeIndex(0);  
      setCurrentCardIndex(0);
      return;
    }

    const deck = decks.find(d => d.id === deckId);
    if (deck) {
      setActiveDeck(deck);
      setCurrentThemeIndex(0);
      setCurrentCardIndex(0);
      
      // Update last accessed time
      setDecks(prev => prev.map(d => 
        d.id === deckId 
          ? { ...d, lastAccessed: new Date().toISOString() }
          : d
      ));
    }
  };

  const deleteDeck = (deckId: string) => {
    setDecks(prev => prev.filter(d => d.id !== deckId));
    if (activeDeck?.id === deckId) {
      setActiveDeck(null);
      setCurrentThemeIndex(0);
      setCurrentCardIndex(0);
    }
    
    // Clean up progress data
    setCompletedCards(prev => {
      const updated = { ...prev };
      delete updated[deckId];
      return updated;
    });
  };

  const currentTheme = activeDeck?.data.themes[currentThemeIndex];
  
  const nextCard = () => {
    if (!currentTheme) return;
    
    if (currentCardIndex < currentTheme.flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else if (currentThemeIndex < (activeDeck?.data.themes.length || 0) - 1) {
      setCurrentThemeIndex(currentThemeIndex + 1);
      setCurrentCardIndex(0);
    }
  };
  
  const previousCard = () => {
    if (!currentTheme) return;
    
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    } else if (currentThemeIndex > 0) {
      setCurrentThemeIndex(currentThemeIndex - 1);
      const prevTheme = activeDeck?.data.themes[currentThemeIndex - 1];
      setCurrentCardIndex((prevTheme?.flashcards.length || 1) - 1);
    }
  };
  
  const selectTheme = (index: number) => {
    if (index >= 0 && index < (activeDeck?.data.themes.length || 0)) {
      setCurrentThemeIndex(index);
      setCurrentCardIndex(0);
    }
  };

  const markCardCompleted = (themeId: string, cardId: string) => {
    if (!activeDeck) return;
    
    setCompletedCards(prev => {
      const deckProgress = prev[activeDeck.id] || new Set();
      const updated = { ...prev };
      updated[activeDeck.id] = new Set(deckProgress).add(`${themeId}-${cardId}`);
      return updated;
    });
  };

  const resetThemeProgress = (themeId: string) => {
    if (!activeDeck) return;
    
    setCompletedCards(prev => {
      const updated = { ...prev };
      const deckProgress = new Set(updated[activeDeck.id]);
      
      // Remove all cards from this theme
      Array.from(deckProgress).forEach(key => {
        if (key.startsWith(themeId)) {
          deckProgress.delete(key);
        }
      });
      
      updated[activeDeck.id] = deckProgress;
      return updated;
    });
  };

  const getThemeProgress = (themeId: string): number => {
    if (!activeDeck) return 0;
    
    const theme = activeDeck.data.themes.find(t => t.themeName === themeId);
    if (!theme) return 0;
    
    const deckProgress = completedCards[activeDeck.id] || new Set();
    const themeCompleted = Array.from(deckProgress)
      .filter(key => key.startsWith(themeId)).length;
    
    return theme.flashcards.length > 0 
      ? Math.round((themeCompleted / theme.flashcards.length) * 100) 
      : 0;
  };

  const clearAllData = () => {
    localStorage.removeItem(DECKS_KEY);
    localStorage.removeItem(PROGRESS_KEY);
    setDecks([]);
    setActiveDeck(null);
    setCompletedCards({});
    setCurrentThemeIndex(0);
    setCurrentCardIndex(0);
  };
  
  return {
    decks,
    activeDeck,
    currentTheme,
    currentThemeIndex,
    currentCardIndex,
    error,
    isLoading,
    loadFlashcards,
    selectDeck,
    deleteDeck,
    nextCard,
    previousCard,
    selectTheme,
    markCardCompleted,
    resetThemeProgress,
    getThemeProgress,
    completedCards,
    clearAllData
  };
};