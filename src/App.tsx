import { useState } from 'react';
import { Link2, MessageSquare } from 'lucide-react';
import WhatsAppForm from './components/WhatsAppForm';
import URLShortener from './components/URLShortener';

export default function App() {
  const [activeTab, setActiveTab] = useState<'url' | 'whatsapp'>('url');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Link Shortener</h1>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 
                ${activeTab === 'url' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              <Link2 className="w-5 h-5" />
              URL Shortener
            </button>
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2
                ${activeTab === 'whatsapp'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              <MessageSquare className="w-5 h-5" />
              WhatsApp Link
            </button>
          </div>

          {activeTab === 'url' ? <URLShortener /> : <WhatsAppForm />}
        </div>
      </div>
    </div>
  );
}
