import { useEffect } from 'react';

export default function RedirectHandler() {
  useEffect(() => {
    const path = window.location.pathname.substring(1); // Remove leading slash
    if (path) {
      const urlMappings = JSON.parse(localStorage.getItem('urlMappings') || '{}');
      const originalUrl = urlMappings[path];
      
      if (originalUrl) {
        window.location.href = originalUrl;
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Redirecting...</p>
    </div>
  );
}
