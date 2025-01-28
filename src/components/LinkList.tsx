import { useEffect, useState } from 'react';
import { ExternalLink, Copy } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { UrlLink } from '../types/database.types';

export default function LinkList() {
  const [links, setLinks] = useState<UrlLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLinks(data || []);
    } catch (err) {
      setError('Failed to fetch links');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="text-center">Loading links...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (links.length === 0) {
    return <div className="text-gray-500">No links generated yet</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Recent Links</h2>
      <div className="space-y-3">
        {links.map((link) => {
          const shortUrl = `${window.location.origin}/${link.short_id}`;
          return (
            <div key={link.id} className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="truncate flex-1">
                  <a
                    href={link.original_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 truncate"
                  >
                    {link.original_url}
                  </a>
                </div>
                <span className="text-sm text-gray-500 ml-2">
                  {formatDate(link.created_at)}
                </span>
              </div>
              
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={shortUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm"
                />
                <button
                  onClick={() => copyToClipboard(shortUrl)}
                  className="p-2 text-gray-600 hover:text-gray-800"
                  title="Copy to clipboard"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-gray-800"
                  title="Open link"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
              
              <div className="text-sm text-gray-500">
                {link.clicks} {link.clicks === 1 ? 'click' : 'clicks'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
