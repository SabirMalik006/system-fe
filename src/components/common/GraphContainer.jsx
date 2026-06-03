import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';

const GraphContainer = ({ 
  title, 
  loading, 
  error, 
  isEmpty, 
  emptyMessage = "No data available for this period", 
  children,
  className = ""
}) => {
  if (loading) {
    return (
      <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center min-h-[300px] ${className}`}>
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
        <p className="text-sm text-gray-500 font-medium">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-2xl border border-red-100 shadow-sm p-6 flex flex-col items-center justify-center min-h-[300px] ${className}`}>
        <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
        <p className="text-sm text-red-600 font-bold mb-1">Connection Failed</p>
        <p className="text-xs text-red-500 text-center">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center min-h-[300px] ${className}`}>
        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-sm text-gray-400 italic">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 ${className}`}>
      {title && (
        <h3 className="text-xs font-medium text-gray-700 tracking-widest uppercase mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default GraphContainer;
