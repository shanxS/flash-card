import React from 'react';
import { BookOpen, Github, Trash2 } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onClearData?: () => void;
  hasData: boolean;
}

const Header: React.FC<HeaderProps> = ({ onReset, onClearData, hasData }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div onClick={onReset} className="cursor-pointer flex items-center">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">FlashLearn</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {hasData && onClearData && (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all data? This will remove your flashcards and progress.')) {
                    onClearData();
                  }
                }}
                className="text-gray-500 hover:text-red-600 transition-colors flex items-center"
                title="Clear all data"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 transition-colors flex items-center"
            >
              <Github className="h-5 w-5 mr-1" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header