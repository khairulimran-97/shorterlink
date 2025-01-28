import { useState } from 'react';
import { Link, Copy, ExternalLink } from 'lucide-react';
import { nanoid } from 'nanoid';

export default function URLShortener() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  const isValidUrl = (urlString: string) => {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const generateShortUrl = () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setError('');
    const shortId = nanoid(8);
    const baseUrl = window.location.origin;
    setShortUrl(`${baseUrl}/${shortId}`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError('');
          }}
          className={`w-full px-3 py-2 border rounded-lg ${
            error ? 'border-red-500' : ''
          }`}
          placeholder="Enter URL to shorten..."
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>

      <button
        onClick={generateShortUrl}
        className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        <Link className="inline-block w-5 h-5 mr-2" />
        Shorten URL
      </button>

      {shortUrl && (
        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between gap-2">
            <input
              type="text"
              value={shortUrl}
              readOnly
              className="flex-1 px-3 py-2 bg-gray-50 rounded-lg"
            />
            <button
              onClick={copyToClipboard}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <Copy className="w-5 h-5" />
            </button>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
