import React, { useEffect } from 'react';
import { Theme, Flashcard as FlashcardType } from '../types/flashcard';
import Flashcard from './Flashcard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StudyViewProps {
  theme: Theme;
  currentCardIndex: number;
  totalThemes: number;
  currentThemeIndex: number;
  onNextCard: () => void;
  onPreviousCard: () => void;
  onMarkCompleted: (themeId: string, cardId: string) => void;
  isCardCompleted: (themeId: string, cardId: string) => boolean;
}

const StudyView: React.FC<StudyViewProps> = ({
  theme,
  currentCardIndex,
  totalThemes,
  currentThemeIndex,
  onNextCard,
  onPreviousCard,
  onMarkCompleted,
  isCardCompleted
}) => {
  const currentCard = theme.flashcards[currentCardIndex];
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowRight') {
        onNextCard();
      } else if (e.code === 'ArrowLeft') {
        onPreviousCard();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNextCard, onPreviousCard]);

  if (!currentCard) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No cards available in this theme.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-xl font-semibold text-gray-800">{theme.themeName}</h2>
        <div className="text-sm text-gray-500">
          Theme {currentThemeIndex + 1} of {totalThemes}
        </div>
      </div>
      
      <div className="flex-grow flex flex-col">
        <Flashcard 
          card={currentCard} 
          onComplete={() => onMarkCompleted(theme.themeName, currentCard.id)}
          isCompleted={isCardCompleted(theme.themeName, currentCard.id)}
        />
        
        <div className="flex items-center justify-between mt-6 px-4">
          <div className="text-sm text-gray-500">
            Card {currentCardIndex + 1} of {theme.flashcards.length}
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={onPreviousCard}
              disabled={currentThemeIndex === 0 && currentCardIndex === 0}
              className={`p-2 rounded-full transition-colors ${
                currentThemeIndex === 0 && currentCardIndex === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Previous card"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button
              onClick={onNextCard}
              disabled={currentThemeIndex === totalThemes - 1 && currentCardIndex === theme.flashcards.length - 1}
              className={`p-2 rounded-full transition-colors ${
                currentThemeIndex === totalThemes - 1 && currentCardIndex === theme.flashcards.length - 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Next card"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyView;