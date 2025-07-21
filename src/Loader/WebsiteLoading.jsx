import React from 'react';

const WebsiteLoading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-lg font-medium text-gray-700">Loading Website...</p>
      </div>
    </div>
  );
};

export default WebsiteLoading;
