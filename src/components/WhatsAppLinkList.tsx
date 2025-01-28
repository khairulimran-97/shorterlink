import { useEffect, useState } from 'react';
import { ExternalLink, Copy } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface WhatsAppGroup {
  id: string;
  group_id: string;
  name: string;
  created_at: string;
}

export default function WhatsAppLinkList() {
  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGroups(data || []);
    } catch (err) {
      setError('Failed to fetch WhatsApp groups');
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
    return <div className="text-center">Loading WhatsApp groups...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (groups.length === 0) {
    return <div className="text-gray-500">No WhatsApp groups created yet</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">WhatsApp Rotate Links</h2>
      <div className="space-y-3">
        {groups.map((group) => {
          const shortUrl = `${window.location.origin}/ws/${group.group_id}`;
          return (
            <div key={group.id} className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-medium">{group.name}</div>
                <span className="text-sm text-gray-500">
                  {formatDate(group.created_at)}
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
