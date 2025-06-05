import React from 'react';
import { FileJson, Upload } from 'lucide-react';

interface EmptyStateProps {
  onUploadClick: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onUploadClick }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
      <FileJson className="h-20 w-20 text-blue-500 mb-6" />
      
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        No Flashcards Loaded
      </h2>
      
      <p className="text-gray-600 max-w-md mb-8">
        Upload a JSON file with your flashcards to get started. 
        Your flashcards will be organized by themes for easy studying.
      </p>
      
      <button 
        onClick={onUploadClick}
        className="flex items-center px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
      >
        <Upload className="h-5 w-5 mr-2" />
        Upload Flashcards
      </button>
      
      <div className="mt-12 text-sm text-gray-500">
        <p className="mb-2">Your data stays in your browser and is never sent to any server.</p>
      </div>
    </div>
  );
};

export default EmptyState;