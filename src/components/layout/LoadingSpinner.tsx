// src/components/layout/LoadingSpinner.tsx
import React from 'react';
import { Loader2 } from 'lucide-react'; // Assuming you have lucide-react installed

interface LoadingSpinnerProps {
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex items-center space-x-3 p-6 bg-white shadow-lg rounded-lg">
        {/* Use the Lucide React Loader2 icon and apply an animate-spin class */}
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        <p className="text-lg text-gray-700">{text}</p>
      </div>
    </div>
  );
}; // The extra closing parenthesis has been removed here

export default LoadingSpinner;
