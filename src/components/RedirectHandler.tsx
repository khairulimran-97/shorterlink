import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function RedirectHandler() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleRedirect = async () => {
      const path = window.location.pathname.substring(1);
      
      if (!path) {
        return;
      }

      try {
        const { data: linkData, error: linkError } = await supabase
          .from('links')
          .select('original_url')
          .eq('short_id', path)
          .single();

        if (linkError) {
          console.error('Link error:', linkError);
          setError('Link not found');
          return;
        }

        if (linkData) {
          window.location.href = linkData.original_url;
        } else {
          setError('Link not found');
        }
      } catch (err) {
        console.error('Redirect error:', err);
        setError('Failed to process redirect');
      }
    };

    handleRedirect();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Redirecting...</p>
    </div>
  );
}
