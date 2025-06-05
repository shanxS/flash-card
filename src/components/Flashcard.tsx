import React, { useState, useEffect } from 'react';
import { Flashcard as FlashcardType } from '../types/flashcard';
import { RotateCw, CheckCircle } from 'lucide-react';

interface FlashcardProps {
  card: FlashcardType;
  onComplete: () => void;
  isCompleted: boolean;
}

const Flashcard: React.FC<FlashcardProps> = ({ card, onComplete, isCompleted }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Reset flip state when card changes
  useEffect(() => {
    setIsFlipped(false);
    setIsAnimating(false);
  }, [card.id]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        flipCard();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const flipCard = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsFlipped(!isFlipped);
    
    // Reset animating state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  return (
    <div className="w-full max-w-2xl aspect-[3/2] mx-auto my-4 perspective-1000">
      <div 
        className={`relative w-full h-full transition-transform duration-600 transform-style-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={flipCard}
      >
        {/* Front of card */}
        <div 
          className={`absolute w-full h-full backface-hidden rounded-xl shadow-lg bg-white p-8 flex flex-col
            ${isCompleted ? 'border-2 border-green-500' : 'border border-gray-200'}
          `}
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium text-gray-500">Question</span>
            {isCompleted && <CheckCircle className="h-6 w-6 text-green-500" />}
          </div>
          
          <div className="flex-grow flex items-center justify-center">
            <p className="text-xl md:text-2xl font-medium text-center">{card.front}</p>
          </div>
          
          <div className="flex justify-center mt-4">
            <div className="text-sm text-gray-500 flex items-center">
              <RotateCw className="h-4 w-4 mr-1" />
              <span>Click to flip</span>
            </div>
          </div>
        </div>
        
        {/* Back of card */}
        <div 
          className="absolute w-full h-full backface-hidden rounded-xl shadow-lg bg-blue-50 p-8 flex flex-col rotate-y-180"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium text-blue-600">Answer</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onComplete();
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                isCompleted 
                  ? 'bg-green-100 text-green-800 cursor-default' 
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              {isCompleted ? 'Completed' : 'Mark as Complete'}
            </button>
          </div>
          
          <div className="flex-grow flex items-center justify-center">
            <p className="text-xl md:text-2xl text-center">{card.back}</p>
          </div>
          
          <div className="flex justify-center mt-4">
            <div className="text-sm text-blue-600 flex items-center">
              <RotateCw className="h-4 w-4 mr-1" />
              <span>Click to flip back</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;