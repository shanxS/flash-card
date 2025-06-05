import React, { useState, useRef } from 'react';
import { useFlashcards } from './hooks/useFlashcards';
import FileUpload from './components/FileUpload';
import ThemeSelector from './components/ThemeSelector';
import StudyView from './components/StudyView';
import Header from './components/Header';
import EmptyState from './components/EmptyState';
import DeckList from './components/DeckList';

function App() {
  const {
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
  } = useFlashcards();

  const [showUpload, setShowUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    loadFlashcards(file);
    setShowUpload(false);
  };

  const handleReset = () => {
    selectDeck(null);
    setShowUpload(false);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const isCardCompleted = (themeId: string, cardId: string): boolean => {
    if (!activeDeck) return false;
    return completedCards[activeDeck.id]?.has(`${themeId}-${cardId}`) || false;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header 
        onReset={handleReset} 
        onClearData={clearAllData}
        hasData={decks.length > 0}
      />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {showUpload ? (
          <>
            <FileUpload 
              onFileUpload={handleFileUpload} 
              isLoading={isLoading} 
              error={error} 
            />
            <input 
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
              className="hidden"
            />
          </>
        ) : activeDeck ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <ThemeSelector 
                themes={activeDeck.data.themes}
                currentThemeIndex={currentThemeIndex}
                onSelectTheme={selectTheme}
                getThemeProgress={getThemeProgress}
                onResetProgress={resetThemeProgress}
              />
              
              <div className="mt-4 flex justify-center space-x-4">
                <button 
                  onClick={handleReset}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Back to Decks
                </button>
                <button 
                  onClick={() => setShowUpload(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Upload New Deck
                </button>
              </div>
            </div>
            
            <div className="md:col-span-2">
              {currentTheme && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                  <StudyView 
                    theme={currentTheme}
                    currentCardIndex={currentCardIndex}
                    totalThemes={activeDeck.data.themes.length}
                    currentThemeIndex={currentThemeIndex}
                    onNextCard={nextCard}
                    onPreviousCard={previousCard}
                    onMarkCompleted={markCardCompleted}
                    isCardCompleted={isCardCompleted}
                  />
                </div>
              )}
            </div>
          </div>
        ) : decks.length > 0 ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Your Flashcard Decks</h2>
              <button
                onClick={() => setShowUpload(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Upload New Deck
              </button>
            </div>
            <DeckList 
              decks={decks}
              onSelectDeck={selectDeck}
              onDeleteDeck={deleteDeck}
            />
          </div>
        ) : (
          <EmptyState onUploadClick={() => setShowUpload(true)} />
        )}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>FlashLearn - Created with ♥ for efficient learning</p>
          <p className="mt-1">Use keyboard shortcuts: Space to flip cards, Arrow keys for navigation</p>
        </div>
      </footer>
    </div>
  );
}

export default App;