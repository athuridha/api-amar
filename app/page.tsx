'use client';

import { useEffect, useState } from 'react';

type Status = 'checking' | 'active' | 'error';

export default function Home() {
  const [status, setStatus] = useState<Status>('checking');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();

      if (data.status === 'ok') {
        setStatus('active');
      } else {
        setStatus('error');
        setError(data.error || 'Unknown error');
      }
    } catch (e) {
      setStatus('error');
      setError('Failed to connect');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center font-[system-ui]">
      <div className="text-center">
        {status === 'checking' && (
          <>
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
              <svg className="w-10 h-10 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Checking...</h1>
            <p className="text-gray-500 text-lg">Verifying API status</p>
          </>
        )}

        {status === 'active' && (
          <>
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">API Active</h1>
            <p className="text-gray-500 text-lg mb-6">Rumah123 Scraper API is running</p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>All systems operational</span>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">API Error</h1>
            <p className="text-red-500 text-lg mb-6">{error}</p>
            <button
              onClick={checkHealth}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
            >
              Retry
            </button>
          </>
        )}
      </div>
    </div>
  );
}
