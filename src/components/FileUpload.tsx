import React, { useRef, useState } from 'react';
import { Upload, FileText } from 'lucide-react';

import exampleData from '../../public/examples/ckad.json';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
  error: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isLoading, error }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleLoadExample = async () => {
    try {
      const jsonString = JSON.stringify(exampleData, null, 2);
      
      // Create a File object from the example data
      const blob = new Blob([jsonString], { type: 'application/json' });
      const file = new File([blob], 'sample-flashcards.json', { type: 'application/json' });
      
      onFileUpload(file);
    } catch (err) {
      console.error('Failed to load example file:', err);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-200 
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          className="hidden"
        />
        
        <Upload className="w-16 h-16 mx-auto mb-4 text-blue-500" />
        
        <h3 className="text-xl font-medium mb-2">
          {isLoading ? 'Uploading...' : 'Upload your flashcards'}
        </h3>
        
        <p className="text-gray-500 mb-2">
          Drag and drop your JSON file here, or click to select
        </p>
        
        <p className="text-sm text-gray-400">
          Only JSON files with valid flashcard format are supported
        </p>
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={handleLoadExample}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
        <FileText className="w-4 h-4 mr-2" />
          Load Example File
        </button>
        <p className="text-xs text-gray-500 mt-1">
          Try with our sample flashcards
        </p>
      </div>

      <div className="mt-8">
        <h4 className="text-lg font-medium mb-3">Sample JSON Format</h4>
        <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto max-h-60">
{`{
  "themes": [
    {
      "themeName": "Theme Name",
      "flashcards": [
        {
          "id": "card-1",
          "front": "Question",
          "back": "Answer"
        }
      ]
    }
  ]
}`}
        </pre>
      </div>
    </div>
  );
};

export default FileUpload;