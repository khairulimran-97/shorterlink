import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function RedirectPage() {
  const { shortId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const redirectToUrl = async () => {
      try {
        const { data, error } = await supabase
          .from('links')
          .select('original_url, clicks')
          .eq('short_id', shortId)
          .single();

        if (error) throw error;
        if (!data) {
          setError('Link not found');
          return;
        }

        await supabase
          .from('links')
          .update({ clicks: (data.clicks || 0) + 1 })
          .eq('short_id', shortId);

        let url = data.original_url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url;
        }

        window.location.replace(url);
      } catch (err) {
        console.error('Redirect error:', err);
        setError('Link not found');
      }
    };

    if (shortId) {
      redirectToUrl();
    }
  }, [shortId, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
