import React from 'react';
import { Theme } from '../types/flashcard';
import { ChevronRight, BarChart2 } from 'lucide-react';

interface ThemeSelectorProps {
  themes: Theme[];
  currentThemeIndex: number;
  onSelectTheme: (index: number) => void;
  getThemeProgress: (themeId: string) => number;
  onResetProgress: (themeId: string) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themes,
  currentThemeIndex,
  onSelectTheme,
  getThemeProgress,
  onResetProgress
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Themes</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {themes.map((theme, index) => {
          const progress = getThemeProgress(theme.themeName);
          
          return (
            <div 
              key={theme.themeName}
              className={`p-4 flex items-center justify-between cursor-pointer transition-colors hover:bg-gray-50 
                ${currentThemeIndex === index ? 'bg-blue-50' : ''}`}
              onClick={() => onSelectTheme(index)}
            >
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className={`font-medium ${currentThemeIndex === index ? 'text-blue-600' : 'text-gray-700'}`}>
                    {theme.themeName}
                  </h3>
                  {currentThemeIndex === index && (
                    <ChevronRight className="ml-2 h-4 w-4 text-blue-500" />
                  )}
                </div>
                
                <div className="flex items-center mt-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full mr-3">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 min-w-[45px]">{progress}%</span>
                </div>
                
                <div className="mt-1 flex items-center">
                  <BarChart2 className="h-3 w-3 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500">
                    {theme.flashcards.length} cards
                  </span>
                </div>
              </div>
              
              {progress > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onResetProgress(theme.themeName);
                  }}
                  className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeSelector;