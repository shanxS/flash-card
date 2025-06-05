import React from 'react';
import { DeckInfo } from '../types/flashcard';
import { BookOpen, Trash2, Clock } from 'lucide-react';

interface DeckListProps {
  decks: DeckInfo[];
  onSelectDeck: (deckId: string) => void;
  onDeleteDeck: (deckId: string) => void;
}

const DeckList: React.FC<DeckListProps> = ({ decks, onSelectDeck, onDeleteDeck }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {decks.map(deck => (
        <div 
          key={deck.id}
          className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:border-blue-300 transition-colors"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <BookOpen className="h-6 w-6 text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {deck.name}
                </h3>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Are you sure you want to delete this deck?')) {
                    onDeleteDeck(deck.id);
                  }
                }}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Delete deck"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600">
                {deck.data.themes.length} themes • {deck.totalCards} cards
              </p>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                Last accessed: {formatDate(deck.lastAccessed)}
              </div>
            </div>
            
            <button
              onClick={() => onSelectDeck(deck.id)}
              className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Study Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeckList;