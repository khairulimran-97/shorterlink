import { useState, useEffect } from 'react';
import { Link, Copy, ExternalLink } from 'lucide-react';
import { nanoid } from 'nanoid';
import { supabase } from '../lib/supabase';
import type { UrlLink } from '../types/database.types';
import LinkList from './LinkList';

export default function URLShortener() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'success' | 'error'>('checking');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .limit(1);

      if (error) throw error;
      setConnectionStatus('success');
      console.log('Connection successful:', data);
    } catch (err) {
      console.error('Connection error:', err);
      setConnectionStatus('error');
    }
  };

  const isValidUrl = (urlString: string) => {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const generateShortUrl = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const shortId = nanoid(8);
      const { error: dbError } = await supabase
        .from('links')
        .insert([
          {
            original_url: url,
            short_id: shortId,
          },
        ]);

      if (dbError) throw dbError;

      const baseUrl = window.location.origin;
      setShortUrl(`${baseUrl}/${shortId}`);
      setUrl('');
    } catch (err) {
      setError('Failed to generate short URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="space-y-4">
        {connectionStatus === 'checking' && (
          <div className="text-blue-500 text-sm">Checking Supabase connection...</div>
        )}
        {connectionStatus === 'success' && (
          <div className="text-green-500 text-sm">✓ Connected to Supabase</div>
        )}
        {connectionStatus === 'error' && (
          <div className="text-red-500 text-sm">× Failed to connect to Supabase</div>
        )}

        <div>
          <input
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError('');
            }}
            className={`w-full px-3 py-2 border rounded-lg text-sm sm:text-base ${
              error ? 'border-red-500' : ''
            }`}
            placeholder="Enter URL to shorten..."
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>

        <button
          onClick={generateShortUrl}
          disabled={loading}
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 text-sm sm:text-base"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            </span>
          ) : (
            <>
              <Link className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Shorten URL
            </>
          )}
        </button>

        {shortUrl && (
          <div className="p-3 sm:p-4 border rounded-lg">
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                value={shortUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm sm:text-base"
              />
              <button
                onClick={copyToClipboard}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>
        )}
      </div>

      <LinkList />
    </div>
  );
}
