import { useState } from 'react';
import URLShortener from './components/URLShortener';
import WhatsAppForm from './components/WhatsAppForm';
import RotateWhatsApp from './components/RotateWhatsApp';

export default function App() {
  const [activeTab, setActiveTab] = useState<'url' | 'whatsapp' | 'rotate'>('url');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8">Link Shortener</h1>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex space-x-1 mb-6">
            <button
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-2 px-4 rounded-lg ${
                activeTab === 'url'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              URL Shortener
            </button>
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`flex-1 py-2 px-4 rounded-lg ${
                activeTab === 'whatsapp'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              WhatsApp Link
            </button>
            <button
              onClick={() => setActiveTab('rotate')}
              className={`flex-1 py-2 px-4 rounded-lg ${
                activeTab === 'rotate'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Rotate WhatsApp
            </button>
          </div>

          {activeTab === 'url' && <URLShortener />}
          {activeTab === 'whatsapp' && <WhatsAppForm />}
          {activeTab === 'rotate' && <RotateWhatsApp />}
        </div>
      </div>
    </div>
  );
}
